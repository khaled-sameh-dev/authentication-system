export const emailVerificationTemplate = (url: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
<style>
.container{
font-family:Arial;
max-width:600px;
margin:auto;
}
.button{
background:#2563eb;
color:white;
padding:12px 20px;
text-decoration:none;
border-radius:5px;
}
</style>
</head>
<body>
<div class="container">
<h2>
Verify your email address
</h2>
<p>
Thanks for creating an account.
Please verify your email to activate your account.
</p>
<a 
class="button"
href="${url}"
>
Verify Email
</a>
<p>
This verification link will expire soon.
</p>
</div>
</body>
</html>
`;
};
