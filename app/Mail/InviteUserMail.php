<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteUserMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $email;
    public $role;
    public $code;


    /**
     * Create a new message instance.
     *
     * @param string $name
     * @param string $email
     * @param string $role
     * @param string $code
     */
    public function __construct($name, $email, $role, $code)
    {
        $this->name = $name;
        $this->email = $email;
        $this->role = $role;
        $this->code = $code;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject("Invitation to Join as {$this->role}")
            ->view('emails.invite_user');
    }
}
