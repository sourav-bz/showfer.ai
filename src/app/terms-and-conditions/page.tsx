"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../_ui/Navbar";
import { marked } from "marked";

const termsAndConditions = `## Introduction

Welcome to Showfer, operated by Virtus Innovation Labs Pvt. Ltd. ("Company", “us”, “we”, or “our”)!

Below are our Terms of Service, we invite you to carefully read the following pages. It will take you approximately 5 minutes.

These Terms of Service (“Terms”, “Terms of Service”) govern your use of our web pages located at [https://showfer.ai/](https://showfer.ai/) operated by showfer.

Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here [https://showfer.ai/privacy-policy](https://showfer.ai/privacy-policy).

Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.

If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@showfer.ai so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.

## Communications

By creating an Account on our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at.

## Purchases

If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.

You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.

We may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.

We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.

We reserve the right to modify the number of words charged for the output or input or impose any usage restrictions per hour, regardless of what was previously committed at the time of subscription. These changes will be made according to our model capacity to safeguard the interests of all users and to ensure uniform access to the service. We take this step to provide equal opportunity to every user and protect the quality of our service.

We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.

## Contests, Sweepstakes and Promotions

Any contests, sweepstakes or other promotions (collectively, “Promotions”) made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.

## Subscriptions

Some parts of Service are billed on a subscription basis (“Subscription(s)”). You will be billed in advance on a recurring and periodic basis (“Billing Cycle”). Billing cycles are set either on a monthly or quarterly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.

At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or showfer cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting showfer customer support team.

A valid payment method, including credit card or PayPal, is required to process the payment for your subscription. You shall provide showfer with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize showfer to charge all Subscription fees incurred through your account to any such payment instruments.

Should automatic billing fail to occur for any reason, showfer will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.

## Free Trial

showfer may, at its sole discretion, offer a Subscription with a free trial for a limited period of time (“Free Trial”).

You may be required to enter your billing information in order to sign up for Free Trial.

If you do enter your billing information when signing up for Free Trial, you will not be charged by showfer until Free Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable Subscription fees for the type of Subscription you have selected.

At any time and without notice, showfer reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.

## Fee Changes

showfer, in its sole discretion and at any time, may modify Subscription fees for the Subscriptions. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.

At any time and without notice, showfer reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.

Your continued use of Service after Subscription fee change comes into effect constitutes your agreement to pay the modified Subscription fee amount.

## Fair Usage Policy (FUP)

showfer is committed to providing high-quality, reliable service for all users. We expect all our users to avoid misuse or overuse of our services. Overuse by one user may impact the quality of service for others. Users are encouraged to select plans that align with their professional needs and business size. High-usage users should consider upgrading to a more robust plan, requesting a custom plan, or utilizing our business API.

The vast majority of users (over 95%) consistently operate within the defined parameters. Exceeding these parameters could lead to restricted or reduced service access, with or without prior warning.

Our system diligently monitors for automated or robotic behavior to maintain service safety and quality. Please be aware that sharing login details of unlimited accounts for monetary gains is considered illegal. Each seat is intended for one individual user only, and multiple users sharing one account are not permitted.

Warning: Please note that unusually high usage or sharing of login details could lead to account suspension or deletion without prior notice, with no possibility for refunds.

## Prohibited Uses

You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:

- In any way that violates any applicable national or international law or regulation.
- For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.
- To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.
- To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.
- In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
- To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.

Additionally, you agree not to:

- Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service.
- Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.
- Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.
- Use any device, software, or routine that interferes with the proper working of Service.
- Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.
- Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.
- Attack Service via a denial-of-service attack or a distributed denial-of-service attack.
- Take any action that may damage or falsify Company rating.
- Otherwise attempt to interfere with the proper working of Service.

## Analytics

We may use third-party Service Providers to monitor and analyze the use of our Service. You can check our privacy policy to know what tools we use.

## No Use By Minors

Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using any of Company, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service.

## Accounts

When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.

You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.

We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.

## Intellectual Property

Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of showfer and its licensors. Service is protected by copyright, trademark, and other laws of the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of showfer.

## Copyright Policy

We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.

If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to support@showfer.ai, with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “DMCA Notice and Procedure for Copyright Infringement Claims”

You may be held accountable for damages (including costs and attorneys' fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.

## DMCA Notice and Procedure for Copyright Infringement Claims

You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):

- an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest;
- a description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work;
- identification of the URL or other specific location on Service where the material that you claim is infringing is located;
- your address, telephone number, and email address;
- a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;
- a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.

You can contact our team via email at support@showfer.ai

## Error Reporting and Feedback

You may provide us either directly at support@showfer.ai or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service (“Feedback”). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.

## Links To Other Web Sites

Our Service may contain links to third party web sites or services that are not owned or controlled by showfer

showfer has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.

You acknowledge and agree that showfer shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such third party web sites or services.

We strongly advise you to read the Terms of service and Privacy Policies of any third party web sites or services that you visit.

## Disclaimer Of Warranty

These services are provided by company on an “as is” and “as available” basis. Company makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.

Neither company nor any person associated with company makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the services. Without limiting the foregoing, neither company nor anyone associated with company represents or warrants that the services, their content, or any services or items obtained through the services will be accurate, reliable, error-free, or uninterrupted, that defects will be corrected, that the services or the server that makes it available are free of viruses or other harmful components or that the services or any services or items obtained through the services will otherwise meet your needs or expectations.

Company hereby disclaims all warranties of any kind, whether express or implied, statutory, or otherwise, including but not limited to any warranties of merchantability, non-infringement, and fitness for particular purpose.

The foregoing does not affect any warranties which cannot be excluded or limited under applicable law.

## Limitation Of Liability

Except as prohibited by law, you will hold us and our officers, directors, employees, and agents harmless for any indirect, punitive, special, incidental, or consequential damage, however it arises (including attorneys' fees and all related costs and expenses of litigation and arbitration, or at trial or on appeal, if any, whether or not litigation or arbitration is instituted), whether in an action of contract, negligence, or other tortious action, or arising out of or in connection with this agreement, including without limitation any claim for personal injury or property damage, arising from this agreement and any violation by you of any federal, state, or local laws, statutes, rules, or regulations, even if company has been previously advised of the possibility of such damage. Except as prohibited by law, if there is liability found on the part of company, it will be limited to the amount paid for the products and/or services, and under no circumstances will there be consequential or punitive damages. Some states do not allow the exclusion or limitation of punitive, incidental or consequential damages, so the prior limitation or exclusion may not apply to you.

## Termination

We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.

If you wish to terminate your account, you may simply discontinue using Service.

## Governing Law

These Terms shall be governed and construed in accordance with the laws of State of Delaware without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.

## Changes To Service

We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.

## Amendments To Terms

We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.

Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.

By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Service.

## Waiver And Severability

No waiver by Company of any term or condition set forth in Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under Terms shall not constitute a waiver of such right or provision.

If any provision of Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of Terms will continue in full force and effect.

## Acknowledgement

By using service or other services provided by us, you acknowledge that you have read these terms of service and agree to be bound by them.

## Contact Us

You can contact us by emailing to: support@showfer.ai for any queries.
`;

export default function TermsAndConditions() {
  const [content, setContent] = useState("");
  useEffect(() => {
    const parseMdFile = async () => {
      const html = await marked.parse(termsAndConditions);
      setContent(html);
    };
    parseMdFile();
  }, []);

  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      <div className="bg-white text-gray-900 rounded-lg h-full overflow-scroll">
        <div className="h-full mx-auto px-24 py-24 flex flex-col items-center">
          <div className="text-5xl mb-[45px]">Terms & Conditions</div>
          <div>
            <div
              className="prose mb-10"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
