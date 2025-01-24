import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
const errorClasses = "mt-1 text-sm text-red-600";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
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
                      <p className="text-gray-600">+33 X XX XX XX XX</p>
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
                        Je vous réponds sous 48h maximum
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left">
              <div className="bg-white rounded-xl shadow-strong p-6 lg:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className={labelClasses}>
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        {...register('firstName', { required: true })}
                        className={inputClasses}
                      />
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={errorClasses}
                        >
                          Ce champ est requis
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className={labelClasses}>
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        {...register('lastName', { required: true })}
                        className={inputClasses}
                      />
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={errorClasses}
                        >
                          Ce champ est requis
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      })}
                      className={inputClasses}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={errorClasses}
                      >
                        Veuillez entrer une adresse email valide
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClasses}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message', { required: true })}
                      className={inputClasses}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={errorClasses}
                      >
                        Ce champ est requis
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn btn-primary"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner />
                      ) : (
                        'Envoyer le message'
                      )}
                    </button>

                    {submitStatus === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-sm text-green-600"
                      >
                        Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                      </motion.p>
                    )}

                    {submitStatus === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-sm text-red-600"
                      >
                        Une erreur est survenue. Veuillez réessayer plus tard.
                      </motion.p>
                    )}
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
