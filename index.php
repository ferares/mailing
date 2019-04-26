<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;
  require 'vendor/autoload.php';

  // Instantiation and passing `true` enables exceptions
  $mail = new PHPMailer(true);

  // Load the config
  try {
    $config = json_decode(file_get_contents('./config.json'), true);
    $host = $config['host'];
    $auth = $config['auth'];
    $username = $config['username'];
    $password = $config['password'];
    $secure = $config['secure'];
    $port = $config['port'];
    $recipients = $config['recipients'];
  } catch (\Exception $e) {
    echo "Incorrect or missing config.json file!\n";
    echo "Please refer to the README for more information.\n";
    exit;
  }

  while (true) {
    echo 'Type "s" to send "q" to quit > ';
    $handle = fopen ("php://stdin","r");
    $option = fgets($handle);
    if ((trim($option) === 'q') || (trim($option) === 'Q')) {
      echo "Quit.\n";
      exit;
    } else if ((trim($option) === 's') || (trim($option) === 'S')) {
      echo "Sending message\n";
      try {
        //Server settings
        $mail->SMTPDebug = 2; // Enable verbose debug output
        $mail->isSMTP(); // Set mailer to use SMTP
        $mail->Host = $host; // Specify main and backup SMTP servers
        $mail->SMTPAuth = $auth; // Enable SMTP authentication
        $mail->Username = $username; // SMTP username
        $mail->Password = $password; // SMTP password
        $mail->SMTPSecure = $secure; // Enable TLS encryption, `ssl` also accepted
        $mail->Port = $port; // TCP port to connect to

        //Recipients
        $mail->setFrom($username);
        foreach ($recipients as $recipient) {
          $mail->addCC($recipient);
        }

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'Mailing test';
        $mail->Body    = file_get_contents('./build/mailing.html');
        $mail->AltBody = 'Your email client has no HTML support!!';

        $mail->send();
        echo "Message has been sent\n";
      } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n";
      }
    }
  }
