import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { FormEvent, useState } from 'react';
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

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [formErrors, setErrors] = useState<{ [key: string]: { message: string } }>({});

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    const sanitizedData = {
      firstName: DOMPurify.sanitize(data.firstName),
      lastName: DOMPurify.sanitize(data.lastName),
      email: DOMPurify.sanitize(data.email),
      phone: DOMPurify.sanitize(data.phone),
      message: DOMPurify.sanitize(data.message),
  };

  // Error handling
  const newErrors = {};
  if (!sanitizedData.firstName) newErrors.firstName = 'First name is required';
  if (!sanitizedData.email) newErrors.email = 'Email is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
}

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          phone: data.phone,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
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
        Prénom
      </label>
      <input
        type="text"
        id="firstName"
        {...register("firstName")}
        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        required
      />
{formErrors.firstName && <span className={errorClasses}>{formErrors.firstName.message}</span>}
</div>
    <div>
      <label htmlFor="lastName" className={labelClasses}>
        Nom
      </label>
      <input
        type="text"
        id="lastName"
        {...register("lastName")}
        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        required
      />
{formErrors.lastName && <span className={errorClasses}>{formErrors.lastName.message}</span>}

    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="email" className={labelClasses}>
        Email
      </label>
      <input
        type="email"
        id="email"
        {...register("email")}
        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        required
      />
{formErrors.email && <span className={errorClasses}>{formErrors.email.message}</span>}

    </div>
    <div>
      <label htmlFor="phone" className={labelClasses}>
        Téléphone
      </label>
      <input
        type="tel"
        id="phone"
        {...register("phone")}
        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        required
      />
{formErrors.phone && <span className={errorClasses}>{formErrors.phone.message}</span>}

    </div>
  </div>

  <div>
    <label htmlFor="message" className={labelClasses}>
      Message
    </label>
    <textarea
      id="message"
      {...register("message")}
      rows={4}
      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
      required
    />
{formErrors.message && <span className={errorClasses}>{formErrors.message.message}</span>}

  </div>

  <div className="flex justify-end">
  <button 
  type="submit" 
  className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Send
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
