import { useEffect, useState } from 'react';
import { validatePassword } from '../../utils/auth/passwordValidation';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setMessage('');
      return;
    }

    let currentStrength = 0;

    // Length check
    if (password.length >= 8) currentStrength += 20;

    // Uppercase check
    if (/[A-Z]/.test(password)) currentStrength += 20;

    // Lowercase check
    if (/[a-z]/.test(password)) currentStrength += 20;

    // Number check
    if (/[0-9]/.test(password)) currentStrength += 20;

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) currentStrength += 20;

    setStrength(currentStrength);

    // Set message based on strength
    if (currentStrength <= 20) {
      setMessage('Très faible');
    } else if (currentStrength <= 40) {
      setMessage('Faible');
    } else if (currentStrength <= 60) {
      setMessage('Moyen');
    } else if (currentStrength <= 80) {
      setMessage('Fort');
    } else {
      setMessage('Très fort');
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength <= 20
                ? 'bg-red-500'
                : strength <= 40
                ? 'bg-orange-500'
                : strength <= 60
                ? 'bg-yellow-500'
                : strength <= 80
                ? 'bg-lime-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{message}</span>
      </div>
      {validatePassword(password).isValid ? (
        <p className="mt-1 text-sm text-green-600">Mot de passe valide</p>
      ) : (
        <p className="mt-1 text-sm text-gray-500">
          Le mot de passe doit contenir au moins:
          <br />
          - 8 caractères
          <br />
          - Une lettre majuscule
          <br />
          - Une lettre minuscule
          <br />
          - Un chiffre
          <br />
          - Un caractère spécial
        </p>
      )}
    </div>
  );
}
