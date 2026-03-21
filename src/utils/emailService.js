export const sendVerificationEmail = async (email, code) => {
    // وضع التطوير: يعرض الرمز في الـ terminal
    console.log('\n╔════════════════════════════════════════════════╗')
    console.log('║     📧 SHARECHAT - VERIFICATION CODE         ║')
    console.log('╠════════════════════════════════════════════════╣')
    console.log(`║  Email: ${email}`)
    console.log(`║  Code:  ${code}`)
    console.log('╚════════════════════════════════════════════════╝\n')
    return true
  }
  
  export const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }