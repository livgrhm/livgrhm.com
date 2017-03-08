---
layout: post
title: "Hosting a Dropwizard/Java 8 API on an Amazon Web Services EC2 Instance (+ SSL)"
description: "Step by step tutorial for hosting a Dropwizard 1.0.5 / Java 8 API on an Amazon Web Services EC2 Instance and turning on SSL (secure access)."
image: "//dl.dropboxusercontent.com/u/28544515/livgrhm/dropwizard_post.png"
date: 2017-03-07
tags: [aws,dropwizard,java,webservices]
author: "Olivia Graham"
comments: true
share: true
---

*This is a step-by-step tutorial for hosting a <a href="//www.dropwizard.io" target="_blank">Dropwizard</a> webservice on an <a href="//aws.amazon.com/ec2/" target="_blank">Amazon Web Services EC2 Instance</a> over HTTPS.*

The last couple of projects I've worked on have been using Dropwizard (1.0.5) + <a href="http://www.oracle.com/technetwork/java/javase/overview/java8-2100321.html" target="_blank">Java 8</a>. Dropwizard is a great framework for building RESTful webservices; it’s packaged up a bunch of useful libraries (for REST, HTTP, JSON, metrics and database source control to name a few) to get moving quickly, it's lightweight and it's fast.

I find a sensible thing to do when working with a new framework or language is to have a go at implementing an application end to end, by yourself, which tends to give a much better understanding of what's going on under the hood. So I built a <a href="//github.com/livgrhm/kansas-api-dropwizard" target="_blank">simple RESTful webservice</a> with the intention of providing data to an <a href="//ionicframework.com/docs/v2/" target="_blank">Ionic 2</a> mobile app.

I decided to host it on Amazon Web Services, which with guidance and Google was easy enough. BUT THEN... I had somewhat of a nightmare turning on SSL for the application; the service stores user data and allows those users to authenticate, so in the interest of security this was necessary.

So here is a step-by-step guide in the hope it will spare someone the weeks of pain I experienced. I've done my best to make it as clear and specific as possible.

<!-- Checkout my other blog posts for details on actually building the service/mobile app. -->
<!-- // Blog post on building a RESTful web service in Dropwizard/Java 8 here (COMING SOON)
// Blog post on building a native Android/iOS app in Ionic 2 here (COMING SOON) -->

<h2>1. Build your web service in <a href="http://www.dropwizard.io" target="_blank">Dropwizard</a>.</h2>
I'm on v1.0.5 at time of writing. Checkout the Dropwizard documentation - it contains all the information you need to get building a RESTful webservice. Depending on the complexity and what your service does, you will probably need to use <a href="//jdbi.org" target="_blank">JDBI</a> to interface with some relational database; in my case I've worked with a <a href="//www.mysql.com" target="_blank">MySQL</a> database.
In the end you should have:
- Your Dropwizard/Java webservice code, all packaged down into a jar file (use `mvn package`)
- MySQL (or other) database to store/retrieve data

<h2>2. Create an AWS Account</h2>
If you haven't got one already, <a href="//aws.amazon.com" target="_blank">go get one</a>. There's loads of info online about doing it.

<h2>3. Host your database using Amazon RDS</h2>
For your webservice to work in the wild, you'll need any database it uses to be out in the wild too. If you aren't using a database for your service, you can skip this step.
1. Sign into the console
2. Navigate to RDS (via Services menu, or by searching)
3. Navigate to Instances
4. Click 'Launch DB Instance'
5. Choose the relevant DB engine; in my case, MySQL. There are others to suit your needs; some cost money, most offer a free tier.
6. Select for *production*!
7. Below is a screenshot of my settings. Choose these to suit you... there are useful tooltips that explain everything
- Choose the right version; `SELECT @@version;`
- I went with micro. It's a teeny tiny database, I've yet to require anything bigger. (I'll deal with that when it happens)
- Do some research into how much storage you'll need. Be aware that with certain options, you are no longer eligible for the free tier :'(
- Continue through the options for your RDS instance. Then 'Launch Instance'. It will take a bit of time to launch
8. Set up a security group that enables SSH & MySql Access (from your IP only). If you change physical location and you can no longer access, that might be why; you need to update your IP.
9. Create a dump of your development database and run on your AWS instance
10. Voila! Your MySQL db is hosted on le web.

<h2>4. Create an EC2 instance (Virtual Machine in the cloud)</h2>
Brief description of EC2 & why bother.
Please note these are specific instructions for Amazon Linux environment. If you are using a different OS on your virtual machine, you may need to use different commands.
Do not install apache - it may interfere with the Dropwizard server. Apache is not necessary here! I went wrong here for a while; every article online talks about apache and virtual hosts etc etc. Dropwizard spins up it's own HTTP server so doesn't need Apache.
1. Set up your security groups
- Access between DB/EC2
- Make sure 443 (HTTPS) and 22 (SSH) are open
2. SSH into VM. Install Java 8 &amp make sure Java 7 is not installed
- `$ ssh -i ~/.ssh/my-aws.pem ec2-user@52.193.111.xxx`
- `$ sudo yum install java-1.8.0`
- `$ sudo yum remove java-1.7.0-openjdk`
3. Create a new folder to hold your tings
- `mkdir my-app`

<h2>5. Create a release</h2>
Copy your code to a new folder. I do this each time I do a release, to keep simple track of what I’m uploading.
1. Use filezilla to upload jar file to VM (I would put in a new folder)
2. Alter yaml file to use production data - e.g. MySQL DB + dump
3. Don’t commit yaml to version control - it contains passwords etc

<h2>6. Run your service over port 8080</h2>
4. SSH into VM &amp run as normal
5. go to URL -> 8080 deployed
6. cool! Step 1 complete. Now to enable SSL...

<h2>7. Generate SSL Certificates</h2>
1. Install certbot **on VM**
- SSH into VM
- `$ cd my-app`
- `$ curl -O https://dl.eff.org/certbot-auto`
- `$ chmod +x certbot-auto`
2. run certbot to generate the certs. Note: if you have port 443 redirection switched on, turn it off temporarily (e.g. if you are renewing a cert and have done this faff all already)
- `./certbot-auto certonly -w . -d kansas-app.com -d www.kansas-app.com`
- //Will put the certs somewhere so read the logs. Copy the certs from that location to a new folder, and cd to it. From there, run
- `openssl pkcs12 -export -in fullchain.pem  -inkey privkey.pem  -out fullchain_and_key.p12 -name dw -caname root`
- //(the passwords asked for are new ones to create - in this instance I used changeit being unsure, but should be stronger
- //K4nsas_APP1
- `keytool -importkeystore -deststorepass YourMasterPassword -destkeypass YourMasterPassword -destkeystore SchejKeystore.jks -srckeystore cert_and_ket.p12 -srcstoretype PKCS12 -alias dw`
- //this create the new store - using the password from the first step
- //OG:`sudo keytool -importkeystore -deststorepass K4nsas_APP1 -destkeypass K4nsas_APP1 -destkeystore KansasKeystore.jks -srckeystore fullchain_and_key.p12 -srcstoretype PKCS12 -alias dw`
- `keytool -import -trustcacerts -alias root -file fullchain.pem -keystore SchejKeystore.jks`
- this adds the cert chain back in
- //I also did the step above into the java cacerts keystore as the truststore... but not absolutely certain that bit is requried
- `sudo keytool -export -alias dw -file selfsigned.crt -keystore KansasKeystore.jks`
- `sudo keytool -import -trustcacerts -alias dw -file selfsigned.crt -keystore cacerts`

<h2>8. Port Rerouting</h2>
- `sudo iptables -t nat -L --line-numbers` (to list) [OG: empty on new AWS inst]
- `sudo iptables -t nat -D PREROUTING 2` (chosing the right line number to delete)
- `sudo iptables -A PREROUTING -t nat -p tcp --dport 443 -j REDIRECT --to-port 8443` (puts it back in after certbot has run)
- `sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8080` (puts it back in after certbot has run)

<h2>9. Add Redirect Bundle in DW</h2>
Then add bundle in application config

<h2>Finally</h2>
- Running process in a bg thread (add & to command)
- Note on costs

<h2>Useful References</h2>
