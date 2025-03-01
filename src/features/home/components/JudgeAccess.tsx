import React from 'react';
import Link from 'next/link';
import { BaseButton } from '@/components/ui/BaseButton';

interface JudgeAccessProps {
  buttonText?: string;
  subText?: string;
  loginPath?: string;
}

export const JudgeAccess: React.FC<JudgeAccessProps> = ({
  buttonText = "Judge Login",
  subText = "Access for judges and administrators only",
  loginPath = "/login"
}) => {
  return (
    <div className="text-center">
      <Link href={loginPath}>
        <BaseButton size="lg" variant="default">
          {buttonText}
        </BaseButton>
      </Link>
      <p className="text-sm text-neutral-500 mt-3">
        {subText}
      </p>
    </div>
  );
};