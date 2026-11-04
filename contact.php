<?php
/**
 * Contact form handler — rhizomatica.org
 *
 * 1. Validates the Google reCAPTCHA v2 ("I'm not a robot") response.
 * 2. Sanitizes the submitted fields.
 * 3. Sends the message by email and redirects back to the form.
 *
 * NOTE: This file requires a PHP-enabled web server. GitHub Pages does NOT
 * run PHP, so the contact form must be hosted on a server that supports PHP
 * (any shared host, VPS, or a service that runs PHP).
 */

/* ------------------------------------------------------------------ *
 *  Configuration — edit these values
 * ------------------------------------------------------------------ */
$recipient = 'contact@rhizomatica.org';        // destination mailbox
$secretKey = '6Lc8yw4uAAAAAMvIr8JH0pYQpYHt1qpeJEPV1BFU';      // Google reCAPTCHA secret key
$from      = 'no-reply@rhizomatica.org';       // valid sender on your domain
$redirect  = 'contact.html';                   // page to return to

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

function verify_recaptcha($secret, $response, $remoteIp)
{
    $url  = 'https://www.google.com/recaptcha/api/siteverify';
    $data = array(
        'secret'   => $secret,
        'response' => $response,
        'remoteip' => $remoteIp,
    );

    if (function_exists('curl_version')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
        ));
        $result = curl_exec($ch);
        curl_close($ch);
    } else {
        $result = @file_get_contents($url . '?' . http_build_query($data));
    }

    if ($result === false) {
        return false;
    }

    $json = json_decode($result, true);
    return isset($json['success']) && $json['success'] === true;
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

/* ------------------------------------------------------------------ *
 *  Verify the reCAPTCHA
 * ------------------------------------------------------------------ */
$captchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
if ($captchaResponse === '') {
    $errors[] = 'Please complete the CAPTCHA.';
} elseif (!verify_recaptcha($secretKey, $captchaResponse, $_SERVER['REMOTE_ADDR'])) {
    $errors[] = 'CAPTCHA verification failed. Please try again.';
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
