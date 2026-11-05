import {describe,it,expect} from 'bun:test';
import {DEFAULTS} from '../physics/cycle';
import {makeProject,parseProject} from './project';

describe('local Jet Engine Lab projects',()=>{
 const valid=()=>makeProject('Test Study',structuredClone(DEFAULTS),'turbofan',{mode:'inspection',selected:'fan',explode:.5,showShell:true});
 it('round-trips project inputs and view configuration without modifying them',()=>{
  const p=valid(),parsed=parseProject(JSON.stringify(p));
  expect(parsed).toEqual(p);expect(parsed.inputs.turbofan.bypassArea).toBe(DEFAULTS.turbofan.bypassArea);
 });
 it('rejects invalid schema versions without corrupting input',()=>{
  const project=valid();expect(()=>parseProject(JSON.stringify({...project,schema:2}))).toThrow('Unsupported project');
  expect(project.schema).toBe(1);
 });
 it('rejects invalid physical inputs',()=>{
  const p=valid();p.inputs.turbojet.throttle=3;
  expect(()=>parseProject(JSON.stringify(p))).toThrow('throttle');
 });
 it('rejects missing numeric input fields',()=>{
  const p=valid();delete (p.inputs.turbofan as Partial<typeof p.inputs.turbofan>).coreArea;
  expect(()=>parseProject(JSON.stringify(p))).toThrow('Missing');
 });
 it('rejects unsafe view state',()=>{
  const p=valid();p.view.explode=10000;expect(()=>parseProject(JSON.stringify(p))).toThrow('Invalid view');
 });
 it('rejects oversized data and malformed JSON',()=>{
  expect(()=>parseProject('x'.repeat(1_000_001))).toThrow('1 MB');
  expect(()=>parseProject('not JSON')).toThrow('Invalid project JSON');
 });
 it('does not expose a developer identity in default project metadata',()=>{
  const p=makeProject('',structuredClone(DEFAULTS),'turbojet',{mode:'inspection',selected:'',explode:0,showShell:true});
  expect(p.name).toBe('Untitled Study');expect(JSON.stringify(p)).not.toContain('/Users/');
 });
});
