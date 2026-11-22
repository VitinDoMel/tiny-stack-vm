import{mkdirSync as M,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs';

const T=new Uint8Array(256).fill(97,16,35),K=[0,1,1,67,2,73,3,17,4,145,5,161,6,225,7,241,23,81,27,81,31,0,48,5,49,21,50,21,51,5,52,1,64,81,65,33,80,17,81,17,82,65,83,17];
for(let i=0;i<44;i+=2)T[K[i]]=K[i+1];

const E=process.env,I=E.MAKEFUN_INPUT_DIR??'/input',O=E.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of R(I).sort()){
((p,inp)=>{
const n=p.length,Z=Int32Array,D=new Z(256),C=new Z(64),A=new Z(256),Q=Buffer.alloc(65536);
let sp=0,cp=0,ol=0,ip=0,pc=0,st=0,t=0;
const end=(c)=>{M(`${O}/${id}`,{recursive:true});W(`${O}/${id}/stdout.bin`,Q.subarray(0,ol));W(`${O}/${id}/exit.txt`,c+'\n');};
for(;;){
if(st===1e6)return end(10);
if(pc>>>0>=n)return end(9);
const op=p[pc],m=T[op];
if(!m)return end(5);
const imm=m>>1&7;
if(pc+imm>=n)return end(9);
st++;
const pop=m>>4&3,push=m>>6&3,nx=pc+1+imm;
if(sp<pop)return end(2);
if(sp-pop+push>256)return end(3);
pc=nx;
if(m===97){
const b=D[--sp],a=D[sp-1],u=a>>>0,v=b>>>0;
if(op>18&&op<23&&!b)return end(4);
D[sp-1]=[a+b,a-b,Math.imul(a,b),a/b,a%b,u/v,u%v,0,a&b,a|b,a^b,0,a<<b,a>>b,a>>>b,0,+(a===b),+(a<b),+(u<v)][op-16];
continue;
}
if(op>47&&op<51){
if(op<49||(op<50?!D[--sp]:D[--sp]))pc=nx+((p[nx-2]|p[nx-1]<<8)<<16>>16);
continue;
}
if(op===64||op===65){
const k=D[sp-1];
if(k>>>8)return end(6);
if(op<65)D[sp-1]=A[k];
else{A[k]=D[sp-2];sp-=2;}
continue;
}
switch(op){
case 0:return end(0);
case 1:D[sp++]=p[nx-1]<<24>>24;break;
case 2:D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
case 3:sp--;break;
case 4:case 6:D[sp]=D[sp-(op>4?2:1)];sp++;break;
case 5:t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break;
case 7:t=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=t;break;
case 23:D[sp-1]=-D[sp-1];break;
case 27:D[sp-1]=~D[sp-1];break;
case 51:if(cp===64)return end(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
case 52:if(!cp)return end(8);pc=C[--cp];break;
case 80:{const s=''+D[sp-1];if(ol+s.length>65536)return end(11);sp--;ol+=Q.write(s,ol);break;}
case 81:if(ol>>16)return end(11);Q[ol++]=D[--sp]&255;break;
case 82:D[sp++]=ip<inp.length?inp[ip++]:-1;break;
case 83:return end(D[--sp]&255);
}
}
})(F(`${I}/${id}/program.bin`),F(`${I}/${id}/input.bin`));
}
