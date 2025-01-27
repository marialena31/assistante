import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import emailjs from '@emailjs/browser';
import DOMPurify from 'dompurify';
import contactContent from '../content/pages/contact.json';

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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const sanitizedData = {
        firstName: DOMPurify.sanitize(data.firstName),
        lastName: DOMPurify.sanitize(data.lastName),
        email: DOMPurify.sanitize(data.email),
        phone: DOMPurify.sanitize(data.phone),
        message: DOMPurify.sanitize(data.message),
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        sanitizedData
      );

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">{contactContent.title}</h1>
                <p className="text-xl text-gray-600">{contactContent.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-8">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl text-primary">✉️</div>
                    <div>
                      <h3 className="font-medium text-dark">
                        {contactContent.contactInfo.email.title}
                      </h3>
                      <a
                        href={`mailto:${contactContent.contactInfo.email.value}`}
                        className="text-gray-600 hover:text-primary"
                      >
                        {contactContent.contactInfo.email.value}
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl text-primary">📱</div>
                    <div>
                      <h3 className="font-medium text-dark">
                        {contactContent.contactInfo.phone.title}
                      </h3>
                      <a
                        href={`tel:${contactContent.contactInfo.phone.value}`}
                        className="text-gray-600 hover:text-primary"
                      >
                        {contactContent.contactInfo.phone.value}
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl text-primary">🕒</div>
                    <div>
                      <h3 className="font-medium text-dark">
                        {contactContent.contactInfo.hours.title}
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {contactContent.contactInfo.hours.value}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl text-primary">⚡</div>
                    <div>
                      <h3 className="font-medium text-dark">
                        {contactContent.contactInfo.response.title}
                      </h3>
                      <p className="text-gray-600">
                        {contactContent.contactInfo.response.value}
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className={labelClasses}>
                          {contactContent.form.fields.firstName.label}
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className={inputClasses}
                          placeholder={contactContent.form.fields.firstName.placeholder}
                          {...register('firstName', { required: contactContent.form.fields.firstName.required })}
                        />
                        {errors.firstName && (
                          <p className={errorClasses}>{contactContent.form.fields.firstName.required}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className={labelClasses}>
                          {contactContent.form.fields.lastName.label}
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className={inputClasses}
                          placeholder={contactContent.form.fields.lastName.placeholder}
                          {...register('lastName', { required: contactContent.form.fields.lastName.required })}
                        />
                        {errors.lastName && (
                          <p className={errorClasses}>{contactContent.form.fields.lastName.required}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className={labelClasses}>
                          {contactContent.form.fields.email.label}
                        </label>
                        <input
                          type="email"
                          id="email"
                          className={inputClasses}
                          placeholder={contactContent.form.fields.email.placeholder}
                          {...register('email', {
                            required: contactContent.form.fields.email.required,
                            pattern: {
                              value: new RegExp(contactContent.form.fields.email.pattern.value, 'i'),
                              message: contactContent.form.fields.email.pattern.message
                            }
                          })}
                        />
                        {errors.email && (
                          <p className={errorClasses}>
                            {errors.email.type === 'pattern'
                              ? contactContent.form.fields.email.pattern.message
                              : contactContent.form.fields.email.required}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className={labelClasses}>
                          {contactContent.form.fields.phone.label}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className={inputClasses}
                          placeholder={contactContent.form.fields.phone.placeholder}
                          {...register('phone', { required: contactContent.form.fields.phone.required })}
                        />
                        {errors.phone && (
                          <p className={errorClasses}>{contactContent.form.fields.phone.required}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClasses}>
                        {contactContent.form.fields.message.label}
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className={inputClasses}
                        placeholder={contactContent.form.fields.message.placeholder}
                        {...register('message', { required: contactContent.form.fields.message.required })}
                      />
                      {errors.message && (
                        <p className={errorClasses}>{contactContent.form.fields.message.required}</p>
                      )}
                    </div>

                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                        {contactContent.form.messages.success}
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                        {contactContent.form.messages.error}
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
                          {contactContent.form.submitButton}
                        </span>
                      ) : (
                        contactContent.form.submitButton
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
