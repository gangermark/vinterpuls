import ts from 'typescript';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const temp=mkdtempSync(join(tmpdir(),'vinterpuls-test-'));
const program=JSON.parse(readFileSync('src/program.json','utf8'));
const programId='vinter-2026-12v';
async function moduleFrom(name){
 let source=readFileSync(`src/${name}.ts`,'utf8').replace("import program from './program.json';",`const program=${JSON.stringify(program)};`).replace("import {programId,type Entry} from './store';",`const programId='${programId}'; type Entry=any;`);
 const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const file=join(temp,name+'.mjs');writeFileSync(file,output);return import(pathToFileURL(file));
}
try {
 const {validateImport}=await moduleFrom('importLog');
 const {summarizeWeek}=await moduleFrom('summary');
 const sessions=program.weeks.flatMap(w=>w.sessions);
 assert.equal(program.weeks.length,12);assert.equal(sessions.length,84);assert.equal(new Set(sessions.map(s=>s.date)).size,84);
 assert(sessions.filter(s=>s.type==='stronglifts').every(s=>s.loggingMode==='none'));
 assert(sessions.filter(s=>s.type==='runningStrength').every(s=>s.loggingMode==='checkbox'));
 const run={sessionId:'w01-d1',programId,completed:true,activityType:'running',distanceKm:6.5,durationMinutes:40,notes:'Test'};
 const spin={sessionId:'w01-d3',programId,completed:true,activityType:'spinning',durationMinutes:50};
 const strength={sessionId:'w01-d5',programId,completed:true,activityType:'runningStrength'};
 const data={schemaVersion:1,programId,entries:[run,spin,strength]};
 assert.deepEqual(validateImport(JSON.parse(JSON.stringify(data))),data.entries);
 assert.deepEqual(summarizeWeek(data.entries),{runningKm:6.5,runningMinutes:40,spinningMinutes:50,totalMinutes:90});
 assert.deepEqual(summarizeWeek([]),{runningKm:0,runningMinutes:0,spinningMinutes:0,totalMinutes:0});
 for(const entry of [{...spin,distanceKm:20},{...run,sessionId:'w01-d2'},{...strength,durationMinutes:25},{...run,durationMinutes:-1},{...run,distanceKm:NaN},{...run,programId:'other'},{...run,notes:42},{...run,sessionId:'missing'}]) assert.throws(()=>validateImport({...data,entries:[entry]}));
 assert.throws(()=>validateImport({...data,entries:[run,run]}));
 assert.throws(()=>validateImport({...data,schemaVersion:99}));
 const legacy=readFileSync('src/store.ts','utf8');assert(legacy.includes("indexedDB.open('vinterpuls',1)"));assert(legacy.includes("key:e.programId+':'+e.sessionId"));
 console.log('PASS: 12 weeks / 84 days; logging rules; legacy JSON round trip; separate totals; invalid imports rejected.');
} finally {rmSync(temp,{recursive:true,force:true});}
