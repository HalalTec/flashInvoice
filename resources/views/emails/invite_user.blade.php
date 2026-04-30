<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f6fb;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:40px 32px;text-align:center;">
                            <p style="margin:0;color:#bfdbfe;font-size:13px;letter-spacing:1.6px;font-weight:700;text-transform:uppercase;">Invitation</p>
                            <h1 style="margin:12px 0 0 0;color:#ffffff;font-size:30px;line-height:1.2;font-weight:800;">Welcome to the Team</h1>
                            <p style="margin:12px 0 0 0;color:#dbeafe;font-size:16px;line-height:1.5;">You have been invited to access the audit workspace.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0;font-size:17px;line-height:1.6;">Hi <strong>{{ $name }}</strong>,</p>
                            <p style="margin:16px 0 0 0;font-size:15px;line-height:1.7;color:#334155;">
                                You were added as <strong style="color:#1d4ed8;">{{ $role }}</strong>. Use your email and team access code below to sign in.
                            </p>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                                <tr>
                                    <td style="padding:16px 18px;">
                                        <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1.1px;font-weight:700;">Temporary Access Code</p>
                                        <p style="margin:8px 0 0 0;font-size:24px;letter-spacing:2px;font-weight:800;color:#0f172a;">{{ $code }}</p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                                <tr>
                                    <td align="center" style="border-radius:10px;background-color:#2563eb;">
                                        <a href="{{ url('/login') }}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;border-radius:10px;">
                                            Go to Login
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:22px 0 0 0;font-size:13px;line-height:1.7;color:#64748b;">
                                For security, change your password right after first login.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:22px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">
                                Need help? Contact
                                <a href="mailto:gemctl@gmail.com" style="color:#2563eb;text-decoration:none;font-weight:700;">GEMCTL Support</a>.
                            </p>
                            <p style="margin:8px 0 0 0;font-size:12px;color:#94a3b8;">This invitation was sent by the OOAT platform.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
