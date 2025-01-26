import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import emailjs from '@emailjs/browser';
import DOMPurify from 'dompurify';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
const errorClasses = "mt-1 text-sm text-red-600";

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS public key is not defined');
      return;
    }
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur'
  });

  const onSubmit = async (data: FormData) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration is incomplete');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const sanitizedData = {
      firstName: DOMPurify.sanitize(data.firstName),
      lastName: DOMPurify.sanitize(data.lastName),
      email: DOMPurify.sanitize(data.email),
      phone: DOMPurify.sanitize(data.phone),
      message: DOMPurify.sanitize(data.message),
    };

    try {
      const templateParams = {
        user_name: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
        user_email: sanitizedData.email,
        user_phone: sanitizedData.phone,
        message: sanitizedData.message
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', response);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Contact | Maria-Lena Pietri"
      description="Contactez-moi pour discuter de vos besoins en assistance administrative"
    >
      <section className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <FadeIn direction="right">
              <div className="space-y-8">
                <div>
                  <h1 className="h1 text-gradient mb-6">Contact</h1>
                  <p className="text-lg text-gray-600">
                    Parlons de vos besoins en assistance administrative
                  </p>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl text-primary">✉️</div>
                    <div>
                      <h3 className="font-medium text-dark">Email</h3>
                      <p className="text-gray-600">contact@marialena-pietri.fr</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl text-primary">📱</div>
                    <div>
                      <h3 className="font-medium text-dark">Téléphone</h3>
                      <p className="text-gray-600">+33 7 61 81 11 01</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl text-primary">🕒</div>
                    <div>
                      <h3 className="font-medium text-dark">Horaires</h3>
                      <p className="text-gray-600">
                        Du lundi au vendredi<br />
                        9h00 - 18h00
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl text-primary">⚡</div>
                    <div>
                      <h3 className="font-medium text-dark">Réponse</h3>
                      <p className="text-gray-600">
                        Je vous réponds sous 24h maximum
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left">
              <div className="bg-white rounded-xl shadow-strong p-6 lg:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate={true}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className={labelClasses}>
                        Prénom*
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        id="firstName"
                        {...register("firstName", { required: "Le prénom est requis" })}
                        className={inputClasses}
                      />
                      {errors.firstName && (
                        <span className={errorClasses}>{errors.firstName.message}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClasses}>
                        Nom*
                      </label>
                      <input
                        type="text"
                        name="user_lastname"
                        id="lastName"
                        {...register("lastName", { required: "Le nom est requis" })}
                        className={inputClasses}
                      />
                      {errors.lastName && (
                        <span className={errorClasses}>{errors.lastName.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email*
                      </label>
                      <input
                        type="email"
                        name="user_email"
                        id="email"
                        {...register("email", {
                          required: "L'email est requis",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Adresse email invalide"
                          }
                        })}
                        className={inputClasses}
                      />
                      {errors.email && (
                        <span className={errorClasses}>{errors.email.message}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Téléphone*
                      </label>
                      <input
                        type="tel"
                        name="user_phone"
                        id="phone"
                        {...register("phone", {
                          required: "Le numéro de téléphone est requis",
                          pattern: {
                            value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                            message: "Numéro de téléphone invalide"
                          }
                        })}
                        className={inputClasses}
                      />
                      {errors.phone && (
                        <span className={errorClasses}>{errors.phone.message}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClasses}>
                      Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      {...register("message", { required: "Le message est requis" })}
                      rows={4}
                      className={inputClasses}
                    />
                    {errors.message && (
                      <span className={errorClasses}>{errors.message.message}</span>
                    )}
                  </div>

                  <div className="mt-6">
                    {submitStatus === 'success' && (
                      <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
                        Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                        Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-primary px-4 py-3 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner className="w-5 h-5 mr-2" />
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </Layout>
  );
}
