const GenerateMailBody = (name, debit, credit, store, date) => {
  return `
        <!DOCTYPE html>
<html lang="en">
  <body style="box-sizing: border-box;">
    <div
      class="mail-invoice"
      style="
    width: fit-content;
    max-width: 440px;"
    >
      <div class="mail-title" style="text-align: left;">
        <h4>Antidote Go</h4>
        <h4>Store Credit Receipt</h4>
      </div>
      <div class="mail-body" style="margin: 15px 0 30px 0;">
        <div class="body-msg" style="padding: 20px 20px;">
          <p>Dear ${name},</p>
          <p>Your Antidote Go's Store Credits has been debited by Rs. ${debit}.</p>
          <p>Your remaining balance is Rs. ${credit}.</p>
        </div>
        <div class="body-details" style="padding: 20px 20px;">
          <h4>Transaction Details</h4>
          <p>Store: ${store}</p>
          <p>Date: ${date}</p>
          <p>Credit Used: Rs. ${debit}</p>
          <p>Remaining Credits: Rs. ${credit}</p>
        </div>
      </div>
      <div
        class="mail-footer"
        style="text-align: left; "
      >
        <span style="margin: 15px 0;"
          >Thank you for checking out with Antidote Go's Store Credits</span
        >
        <div
          class="line-seperator"
          style="height: 1px;
        width: 100%;
        background: #333;margin: 15px 0;"
        ></div>
        <h5 style="margin: 15px 0;">Pulchowk, Lalitpur</h5>
      </div>
    </div>
  </body>
</html>
`;
};


const GenerateResetLink = (name, token) =>{
  return `
  <!DOCTYPE html>
  <html lang="en">
    <body style="box-sizing: border-box;">
      <div
        class="mail-invoice"
        style="
      width: fit-content;
      max-width: 700px;"
      >
        <div class="mail-title" style="text-align: left;">
          <h4>Antidote Nepal</h4>
          <h4>Reset Password Link</h4>
        </div>
        <div class="mail-body" style="margin: 15px 0 30px 0;">
          <div class="body-msg" style="padding: 20px 20px;">
            <p>Dear ${name},</p>
            <p>You are receiving this mail because you have requested the reset of the password for your account.</p>
            <p>Please ignore this mail if you have not requested the reset.</p>
            <p>https://antidotenepal.com/accounts/password/change/${token}</p>
          </div>
          
        </div>
        <div
          class="mail-footer"
          style="text-align: left; "
        >
          <span style="margin: 15px 0;"
            >Thank you for using Antidote Nepal's Store</span
          >
          <div
            class="line-seperator"
            style="height: 1px;
          width: 100%;
          background: #333;margin: 15px 0;"
          ></div>
          <h5 style="margin: 15px 0;">Pulchowk, Lalitpur</h5>
        </div>
      </div>
    </body>
  </html>
  `;
}

module.exports = {GenerateMailBody, GenerateResetLink};
