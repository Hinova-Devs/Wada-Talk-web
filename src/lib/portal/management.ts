export function staffRoleName(role: unknown): string {return role === "admin" ? "Super Admin" : "English Lecturer";}
export function codeDays(value: unknown): number | null {const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=365?n:null;}
export function codeIsExpired(expires: unknown,now=Date.now()): boolean {const at=typeof expires==="string"?Date.parse(expires):NaN;return !Number.isFinite(at)||at<=now;}
export function validManagerPassword(value:string): boolean {return value.length>=12&&value.length<=128&&/[a-z]/.test(value)&&/[A-Z]/.test(value)&&/[0-9]/.test(value)&&/[^a-zA-Z0-9]/.test(value);}
