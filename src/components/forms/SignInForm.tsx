"use client";

import { buttonVariants } from "~/components/ui/button";

import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import { TypographyExtraLargeHeader } from "~/components/ui/typography";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import React, { useState } from "react";
import { VisuallyHidden } from "~/components/ui/visually-hidden";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 px-11">
      <Image src="/images/art-3.png" alt="Art" width={306} height={284} className="mt-4" />
      <div className="flex flex-col gap-2 sm:text-center">
        <TypographyExtraLargeHeader>Make your wishes come true!</TypographyExtraLargeHeader>
      </div>
      <p className="mt-6 text-sm text-foreground/80 sm:text-center">
        By signing in, you agree to{" "}
        <button className="underline" onClick={() => setIsTermsOfServiceOpen(true)}>
          Terms of Service
        </button>{" "}
        and{" "}
        <button className="underline" onClick={() => setIsPrivacyPolicyOpen(true)}>
          Privacy Policy
        </button>
        .
      </p>
      <SignInButton wishlistOwner={wishlistOwner} wishId={wishId} />
      <Preview
        title="Privacy Policy"
        description={<PrivacyPolicy />}
        isOpen={isPrivacyPolicyOpen}
        onOpenChange={setIsPrivacyPolicyOpen}
      />
      <Preview
        title="Terms of Service"
        description={<TermsOfService />}
        isOpen={isTermsOfServiceOpen}
        onOpenChange={setIsTermsOfServiceOpen}
      />
    </div>
  );
}

export function SignInButton({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const queryParams = new URLSearchParams();
  const { t } = useTranslation();

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return (
    <a
      className={cn(
        buttonVariants({ variant: "secondary", fullWidth: false }),
        "flex h-12 items-center gap-2 no-underline",
      )}
      href={`/api/auth/google?${queryParams.toString()}`}
    >
      {t("actions.signInWithGoogle")}
    </a>
  );
}

function Preview({
  isOpen,
  onOpenChange,
  title,
  description,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <VisuallyHidden>
            <AlertDialogDescription>{title}</AlertDialogDescription>
          </VisuallyHidden>
          <div className="max-h-[60dvh] overflow-y-auto">{description}</div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PrivacyPolicy() {
  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="font-bold">Data Controller</p>
        <p>
          The data controller for the purposes of this Privacy Policy is Wishcraft. You can contact us at{" "}
          <a href="mailto:support@mywishcraft.app" className="font-semibold">
            support@mywishcraft.app
          </a>
          .
        </p>
      </div>
      <div>
        <p className="font-bold">Personal Data We Collect</p>
        <p>We collect the following personal data from you when you use our service:</p>
        <ul className="pl-4">
          <li className="list-disc">
            Email address, first name, and last name: For account sign-in and identification purposes.
          </li>
          <li className="list-disc">Wishlist items: User-generated content you add to your wishlist.</li>
          <li className="list-disc">IP address: Collected via server logs for security and analytics purposes.</li>
          <li className="list-disc">
            Cookies: We use session cookies to manage your login state and ensure the functionality of the website.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold">Why We Collect Your Data</p>
        <p>We collect and process your personal data for the following purposes:</p>
        <ul className="pl-4">
          <li className="list-disc">
            To provide account and wishlist functionality: To allow you to create, manage, and access your wishlist.
          </li>
          <li className="list-disc">
            To secure the site and prevent abuse: To ensure the integrity and security of the website and protect
            against unauthorized access.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold">How Long We Store Your Data</p>
        <p>
          We retain your personal data, including your wishlist and account data, for as long as your account is active.
          You can delete your account at any time, at which point your data will be deleted from our system.
        </p>
      </div>
      <div>
        <p className="font-bold">Who We Share Your Data With</p>
        <p>We do not share your personal data with third parties except for the following service providers:</p>
        <ul className="pl-4">
          <li className="list-disc">Vercel: Our hosting provider.</li>
          <li className="list-disc">Neon: Our database provider.</li>
        </ul>
        <p>
          These providers may only access your personal data for the purposes of providing and maintaining our services,
          and they are bound by confidentiality obligations.
        </p>
      </div>
      <div>
        <p className="font-bold">Your Rights</p>
        <p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
        <ul className="pl-4">
          <li className="list-disc">Right to Access: You have the right to request access to your personal data.</li>
          <li className="list-disc">
            Right to Rectification: You can request corrections to any incorrect or incomplete data.
          </li>
          <li className="list-disc">Right to Deletion: You can request that we delete your personal data.</li>
          <li className="list-disc">
            Right to Restriction: You can request that we restrict the processing of your personal data in certain
            circumstances.
          </li>
          <li className="list-disc">
            Right to Portability: You can request to receive your personal data in a commonly used format.
          </li>
          <li className="list-disc">
            Right to Object: You can object to certain types of processing of your personal data, including direct
            marketing.
          </li>
          <li className="list-disc">
            Right to Lodge a Complaint: If you believe your rights have been violated, you have the right to lodge a
            complaint with a supervisory authority.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold">Cookies</p>
        <p>
          We use cookies to manage your sign-in state and ensure the functionality of the website. These cookies are
          essential for accessing your account and wishlist features. The authentication cookie is a persistent cookie
          that remains stored in your browser for 30 days, unless you log out manually. It does not track you across
          other sites and is used solely for authentication purposes.
        </p>
      </div>
      <div>
        <p className="font-bold">Contact Information</p>
        <p>
          If you have any questions or concerns regarding this Privacy Policy or wish to exercise your rights, please
          contact us at{" "}
          <a href="mailto:support@mywishcraft.app" className="font-semibold">
            support@mywishcraft.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="font-bold">Acceptance of Terms</p>
        <p>
          By creating an account or using Wishcraft (“the Service”), you agree to these Terms of Service. If you do not
          agree, please do not use the Service.
        </p>
      </div>
      <div>
        <p className="font-bold">Service Description</p>
        <p>
          Wishcraft allows users to create and manage personal wishlists. The Service is provided “as is” and may be
          updated or modified at any time without prior notice.
        </p>
      </div>
      <div>
        <p className="font-bold">User Accounts</p>
        <ul className="pl-4">
          <li className="list-disc">
            You are responsible for maintaining the confidentiality of your login credentials.
          </li>
          <li className="list-disc">You agree not to share your account or impersonate others.</li>
          <li className="list-disc">You may delete your account at any time.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold">User Content</p>
        <ul className="pl-4">
          <li className="list-disc">You retain ownership of the wishlist content you create.</li>
          <li className="list-disc">
            You grant Wishcraft a limited license to store and display your content solely to provide the Service.
          </li>
          <li className="list-disc">You must not create illegal, abusive, or offensive content.</li>
        </ul>
      </div>
      <div>
        <p className="font-bold">Prohibited Use</p>
        <p>You agree not to:</p>
        <ul className="pl-4">
          <li className="list-disc">Use the Service for any unlawful purpose.</li>
          <li className="list-disc">
            Attempt to interfere with or compromise the Service’s security or functionality.
          </li>
          <li className="list-disc">
            Use automated tools (bots, scrapers) to access or use the Service without permission.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold">Termination</p>
        <p>
          We may suspend or terminate your account if you violate these terms or if required by law. Upon termination,
          your data may be deleted.
        </p>
      </div>
      <div>
        <p className="font-bold">Limitation of Liability</p>
        <p>
          Wishcraft is provided “as is” without warranties. We are not liable for any loss or damage arising from your
          use of the Service, to the extent permitted by law.
        </p>
      </div>
      <div>
        <p className="font-bold">Changes to These Terms</p>
        <p>
          We may update these Terms from time to time. If we do, we will notify users by email or by posting a notice on
          the site. Continued use of the Service after changes means you accept the new terms.
        </p>
      </div>
      <div>
        <p className="font-bold">Governing Law</p>
        <p>
          These Terms are governed by the laws of Germany. Any disputes will be resolved in the courts of Berlin,
          Germany.
        </p>
      </div>
      <div>
        <p className="font-bold">Contact</p>
        <p>
          If you have any questions, contact us at{" "}
          <a href="mailto:support@mywishcraft.app" className="font-semibold">
            support@mywishcraft.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}
