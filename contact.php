<?php

/**
 * Contact form handler — rhizomatica.org
 *
 * 1. Sanitizes the submitted fields.
 * 2. Sends the message by email and redirects back to the form.
 *
 * NOTE: This file requires a PHP-enabled web server. GitHub Pages does NOT
 * run PHP, so the contact form must be hosted on a server that supports PHP
 * (any shared host, VPS, or a service that runs PHP).
 */

/* ------------------------------------------------------------------ *
 *  Configuration — edit these values
 * ------------------------------------------------------------------ */
$recipient = 'contact@rhizomatica.org';         // destination mailbox
$from      = 'no-reply@rhizomatica.org';        // valid sender on your domain
$redirect  = 'contact.html';                    // page to return to

/* ------------------------------------------------------------------ *
 *  Only handle POST requests
 * ------------------------------------------------------------------ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $redirect);
    exit;
}

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */
function redirect_back($status, $message = '')
{
    global $redirect;
    $qs = '?status=' . $status;
    if ($message !== '') {
        $qs .= '&msg=' . urlencode($message);
    }
    header('Location: ' . $redirect . $qs);
    exit;
}

/* ------------------------------------------------------------------ *
 *  Collect and sanitize input
 * ------------------------------------------------------------------ */
$name    = isset($_POST['name'])    ? trim(strip_tags($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim(strip_tags($_POST['email']))   : '';
$subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

/* ------------------------------------------------------------------ *
 *  Server-side validation
 * ------------------------------------------------------------------ */
$errors = array();

if ($name === '') {
    $errors[] = 'Please enter your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}
if ($message === '') {
    $errors[] = 'Please enter a message.';
}
if (preg_match('/[\r\n]/', $name) || preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $subject)) {
    $errors[] = 'Invalid input detected.';
}

if (!empty($errors)) {
    redirect_back('error', implode(' ', $errors));
}

/* ------------------------------------------------------------------ *
 *  Send the email
 * ------------------------------------------------------------------ */
$subjectLine = $subject !== '' ? $subject : 'New message from the website';
$body = "Name: $name\nEmail: $email\n\n$message";
$headers = "From: Rhizomatica Website <$from>\r\n" .
    "Reply-To: $email\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";

if (@mail($recipient, $subjectLine, $body, $headers)) {
    redirect_back('success');
} else {
    redirect_back('error', 'Your message could not be sent. Please email us directly at contact@rhizomatica.org.');
}
