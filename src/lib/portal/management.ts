export function staffRoleName(role: unknown): string {return role === "admin" ? "Super Admin" : "English Lecturer";}
export function codeDays(value: unknown): number | null {const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=365?n:null;}
export function codeIsExpired(expires: unknown,now=Date.now()): boolean {const at=typeof expires==="string"?Date.parse(expires):NaN;return !Number.isFinite(at)||at<=now;}
export function validManagerPassword(value:string): boolean {return value.length>=12&&value.length<=128&&/[a-z]/.test(value)&&/[A-Z]/.test(value)&&/[0-9]/.test(value)&&/[^a-zA-Z0-9]/.test(value);}
export function parseOperationsCsv(value:string): Record<string,string>[] {
 const matrix:string[][]=[];let row:string[]=[],cell="",quoted=false;
 for(let index=0;index<value.length;index++){const char=value[index];if(char==='"'){if(quoted&&value[index+1]==='"'){cell+='"';index++;}else quoted=!quoted;}else if(char===','&&!quoted){row.push(cell.trim());cell="";}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&value[index+1]==='\n')index++;row.push(cell.trim());if(row.some(Boolean))matrix.push(row);row=[];cell="";}else cell+=char;}
 row.push(cell.trim());if(row.some(Boolean))matrix.push(row);if(quoted||!matrix.length)return [];
 const headers=matrix[0].map(item=>item.toLowerCase());if(!headers.includes("class_id"))return [];
 return matrix.slice(1).filter(values=>values.some(Boolean)).map(values=>Object.fromEntries(headers.map((header,index)=>[header,values[index]??""])));
}
