export function emailVerificationView(token: string, timeRemaining: number): string {
    const link = `http://localhost:8081/medly/verify/${token}`;
    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    let temp = `
       <div style="max-width: 700px;text-align: center; text-transform: uppercase;
       margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="color: teal;">Welcome to Kolo Bank</h2>
       <p>Please Follow the link by clicking on the button to verify your email
        </p>
        <div style="text-align:center ;">
          <a href=${link}
         style="background: #277BC0; text-decoration: none; color: white;
          padding: 10px 20px; margin: 10px 0;
         display: inline-block;">Click here</a>
         
        </div>
        
        <p>Your verification link will expire in:
        ${minutes} minutes ${seconds} seconds, for you to verify your email.
        </p>
     </div>
        `;
    return temp;
}

export const htmlTemplates = (otp: number) => {
    const temp = `
    <div style="max-width: 700; font-size:110%; border: 10px solid #ddd; padding: 50px 20px; marging: auto;">
        <h2 style ="text-transform: uppercase; text-align: center; color: teal;">Welcome to Medly Social media App</h2>
        <p>Hi there, your otp is <span style="font-weight: bold; font-size: 20px">${otp}</span>, it will expire in 30min</p>
    </div>
    `
    return temp
}
export function htmlTemplate(otp: number) {
    let temp = `
      <div style="max-width: 700px;text-align: center;background: #f4f8fd;
       margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="color: teal;">Welcome to Medly Social media App</h2>
        <div style="text-align:center ; color:black;"><br>
        <h3 style="color: teal;">Hi, Your OTP is ${otp}</h3>
        </div>
     </div>
        `;
    return temp;
}

export const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 8000);

    const otp_expiry = new Date()

    otp_expiry.setTime(new Date().getTime() + 5 * 60 * 1000)

    return { otp, otp_expiry };
}
