import bcrypt from  "bcryptjs"

const password = process.argv[2];

if(!password){
    console.error("Please provide password: node scripts/hash-password.mhs <password>");
    process.exit(1)
}

const hash = await bcrypt.hash(password,12)

console.log(hash.replaceAll("$","\\$"))