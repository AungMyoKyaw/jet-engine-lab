import {compute,type Input} from './cycle';
self.onmessage=(e:MessageEvent<{id:number;input:Input}>)=>{const{id,input}=e.data;try{self.postMessage({id,result:compute(input)});}catch(err){self.postMessage({id,error:err instanceof Error?err.message:String(err)});}};
