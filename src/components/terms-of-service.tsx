import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileCheck, AlertCircle, Scale, CreditCard, UserX, Mail } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Legal Document</Badge>
            <h1 className="mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last Updated: January 2026
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileCheck className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="mb-2">Agreement to Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    These Terms of Service ("Terms") constitute a legally binding agreement between you and Thakur College of Engineering and Technology ("TCET", "we", "us", or "our") regarding your participation in E-Summit 2026. By registering for or attending the event, you agree to be bound by these Terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Acceptance of Terms */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">1. Acceptance of Terms</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  By accessing our website, registering for E-Summit 2026, or attending the event, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you do not agree to these Terms, you must not register for or attend E-Summit 2026.
                </p>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">2. Eligibility</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  To participate in E-Summit 2026, you must:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Be at least 16 years of age (or have parental consent if under 18)</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from attending under any applicable law</li>
                  <li>Be a current student, faculty member, entrepreneur, or industry professional</li>
                </ul>
              </CardContent>
            </Card>

            {/* Registration and Passes */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">3. Registration and Pass Purchase</h3>
                    
                    <h4 className="mb-2 text-sm">3.1 Registration Process</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
                      <li>All registrations must be completed through our official website</li>
                      <li>You must provide accurate personal and contact information</li>
                      <li>Registration is complete only upon receipt of payment confirmation</li>
                      <li>You will receive a QR code pass via email after successful payment</li>
                    </ul>

                    <h4 className="mb-2 text-sm">3.2 Pass Types and Pricing</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Different pass types are available with varying access levels. Pricing is clearly displayed during registration and is subject to change without prior notice.
                    </p>

                    <h4 className="mb-2 text-sm">3.3 Payment Terms</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>All payments must be made in Indian Rupees (INR)</li>
                      <li>We accept payments via credit/debit cards, UPI, and net banking</li>
                      <li>Payment processing is handled by third-party payment gateways</li>
                      <li>All prices include applicable GST as per Indian tax laws</li>
                      <li>Transaction fees, if any, are borne by the participant</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation and Refunds */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">4. Cancellation and Refund Policy</h3>
                
                <h4 className="mb-2 text-sm">4.1 Participant Cancellation</h4>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
                  <li><strong>30+ days before event:</strong> 80% refund (processing fees deducted)</li>
                  <li><strong>15-29 days before event:</strong> 50% refund</li>
                  <li><strong>Less than 15 days:</strong> No refund</li>
                  <li>Refunds will be processed within 15-30 business days</li>
                </ul>

                <h4 className="mb-2 text-sm">4.2 Event Cancellation by TCET</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  In the unlikely event that we cancel or significantly modify E-Summit 2026:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Full refunds will be provided to all registered participants</li>
                  <li>We are not liable for any travel, accommodation, or other expenses incurred</li>
                  <li>Alternative dates may be offered at our discretion</li>
                </ul>
              </CardContent>
            </Card>

            {/* Code of Conduct */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">5. Code of Conduct</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      All participants must:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
                      <li>Behave professionally and respectfully toward all attendees, speakers, and staff</li>
                      <li>Not engage in harassment, discrimination, or inappropriate behavior</li>
                      <li>Comply with all venue rules and event guidelines</li>
                      <li>Not distribute unauthorized promotional materials</li>
                      <li>Not engage in illegal activities or disruptive behavior</li>
                      <li>Follow all safety and security protocols</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Violation of the Code of Conduct may result in immediate expulsion without refund and potential legal action.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">6. Intellectual Property Rights</h3>
                
                <h4 className="mb-2 text-sm">6.1 TCET's Intellectual Property</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  All content, materials, and resources provided during E-Summit 2026, including but not limited to presentations, worksheets, and recordings, are the property of TCET or the respective speakers and are protected by Indian copyright laws.
                </p>

                <h4 className="mb-2 text-sm">6.2 Photography and Recording</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>TCET may photograph, film, or record the event for promotional purposes</li>
                  <li>By attending, you consent to being photographed and recorded</li>
                  <li>Unauthorized recording or streaming of sessions is prohibited</li>
                  <li>You may request to opt-out of promotional materials by contacting us</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">7. Limitation of Liability</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      To the maximum extent permitted by Indian law:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside mb-4">
                      <li>TCET is not liable for any indirect, incidental, or consequential damages</li>
                      <li>Our total liability shall not exceed the amount paid for your pass</li>
                      <li>We are not responsible for loss or theft of personal belongings</li>
                      <li>We are not liable for third-party services or sponsor activities</li>
                      <li>Participants attend at their own risk</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      This limitation does not affect any rights that cannot be waived under Indian consumer protection laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">8. Indemnification</h3>
                <p className="text-sm text-muted-foreground">
                  You agree to indemnify and hold harmless TCET, its officers, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these Terms, your conduct at the event, or your infringement of any third-party rights.
                </p>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">9. Data Protection and Privacy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your personal information is handled in accordance with our Privacy Policy and the Information Technology Act, 2000. By accepting these Terms, you also accept our Privacy Policy.
                </p>
                <p className="text-sm text-muted-foreground">
                  We comply with all applicable Indian data protection laws and regulations.
                </p>
              </CardContent>
            </Card>

            {/* Force Majeure */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">10. Force Majeure</h3>
                <p className="text-sm text-muted-foreground">
                  TCET shall not be liable for any failure to perform due to circumstances beyond our reasonable control, including but not limited to natural disasters, acts of God, government restrictions, pandemics, strikes, or other unforeseen events. In such cases, we may postpone, modify, or cancel the event with appropriate notice.
                </p>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">11. Modifications to Terms</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We reserve the right to modify these Terms at any time. Significant changes will be communicated via email or website notice. Continued participation after changes constitutes acceptance of modified Terms.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <UserX className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">12. Termination</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We reserve the right to:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Refuse or cancel registration for any reason</li>
                      <li>Revoke access to the event for violation of these Terms</li>
                      <li>Ban individuals from future events</li>
                      <li>Take legal action for serious violations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Severability */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">13. Severability</h3>
                <p className="text-sm text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable or invalid under Indian law, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">14. Governing Law and Dispute Resolution</h3>
                
                <h4 className="mb-2 text-sm">14.1 Governing Law</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
                </p>

                <h4 className="mb-2 text-sm">14.2 Jurisdiction</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Any disputes arising from these Terms or your participation in E-Summit 2026 shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>

                <h4 className="mb-2 text-sm">14.3 Dispute Resolution</h4>
                <p className="text-sm text-muted-foreground">
                  Before initiating legal proceedings, parties agree to attempt good faith negotiation for a period of 30 days. If unresolved, disputes may be referred to arbitration in Mumbai as per the Arbitration and Conciliation Act, 1996.
                </p>
              </CardContent>
            </Card>

            {/* Entire Agreement */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">15. Entire Agreement</h3>
                <p className="text-sm text-muted-foreground">
                  These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and TCET regarding E-Summit 2026 and supersede all prior agreements and understandings.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="mb-3">16. Contact Information</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      For questions about these Terms of Service, please contact:
                    </p>
                    <div className="text-sm space-y-2">
                      <p><strong>Thakur College of Engineering and Technology</strong></p>
                      <p>E-Summit 2026 - Legal Department</p>
                      <p>Kandivali East, Mumbai - 400101</p>
                      <p>Email: <a href="mailto:tcetedic@tcetmumbai.in" className="text-primary hover:underline">tcetedic@tcetmumbai.in</a></p>
                      <p>Phone: <a href="tel:+912228471000" className="text-primary hover:underline">+91 22 2847 1000</a></p>
                      <p className="text-muted-foreground">Office Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-center text-muted-foreground">
                  By registering for E-Summit 2026, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
