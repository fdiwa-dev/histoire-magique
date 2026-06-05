import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Mail, MapPin, Gift, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
}

export default function PaymentModal({ isOpen, onClose, planName, price }: PaymentModalProps) {
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [dedication, setDedication] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');

  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !cardNumber) {
      alert("Veuillez remplir les informations requises pour l'expédition et le paiement.");
      return;
    }
    
    setIsPaying(true);
    // Simulate short network delay to process transaction
    setTimeout(() => {
      setIsPaying(false);
      setIsSuccess(true);
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div id="payment_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
          id="payment_modal_container"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="bg-slate-900 border border-purple-500/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
        >
          {/* Top colored bar decoration */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500"></div>

          {/* Close button */}
          <button
            id="close_payment_modal_btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-slate-950/50 text-slate-400 hover:text-slate-100 border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSuccess ? (
            /* PAYMENT FORM VIEW */
            <form onSubmit={handlePay} className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold">
                  Paiement fictif 100% Sécurisé
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-slate-100 mb-1">
                Commander votre livre
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Vos informations d'expédition et personnalisation d'impression.
              </p>

              {/* Order summary box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Produit commandé</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{planName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Total</div>
                  <div className="text-sm font-extrabold text-amber-400 mt-0.5">{price} €</div>
                </div>
              </div>

              {/* Form elements */}
              <div className="space-y-4">
                {/* Email Address */}
                <div>
                  <label htmlFor="payer_email_input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Courriel pour le suivi de livraison <span className="text-pink-500">*</span>
                  </label>
                  <input
                    id="payer_email_input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@exemple.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500"
                  />
                </div>

                {/* Shipping info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="payer_address_input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Adresse de livraison <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="payer_address_input"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="12 Rue des Rêves"
                      className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="payer_city_input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Code Postal & Ville <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="payer_city_input"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="75000 Paris"
                      className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Dedication message */}
                <div>
                  <label htmlFor="payer_dedication_input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-slate-400" /> Dédicace personnalisée (Optionnelle)
                  </label>
                  <textarea
                    id="payer_dedication_input"
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="Ex: 'À ma petite étoile Chloé, que tes rêves brillent toujours. De la part de Mamie.'"
                    rows={2}
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-300 placeholder-slate-600 rounded-lg border border-slate-800 text-xs resize-none outline-none focus:border-purple-500"
                  />
                  <p className="text-[9px] text-slate-500 mt-1">Imprimée en première page du livre physique.</p>
                </div>

                {/* Mock Credit Card section */}
                <div>
                  <label htmlFor="payer_card_number_input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Cartes bancaires (Fictive) <span className="text-pink-500">*</span>
                  </label>
                  <div className="space-y-2.5">
                    <input
                      id="payer_card_number_input"
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4970 8820 1190 2840 (Utilisez n'importe quel code)"
                      className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        id="payer_expiry_input"
                        type="text"
                        required
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500 text-center"
                      />
                      <input
                        id="payer_cvv_input"
                        type="password"
                        required
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 text-xs outline-none focus:border-purple-500 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Magic Button */}
              <button
                id="submit_payer_pay_btn"
                type="submit"
                disabled={isPaying}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest mt-6 cursor-pointer transform transitionactive:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
              >
                {isPaying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Autorisation magique...</span>
                  </>
                ) : (
                  <>
                    <span>Valider ma commande ({price} €)</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* PAYMENT SUCCESS VIEW */
            <div id="payment_success_view" className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/30 mb-4 scale-up duration-300">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-emerald-400 mb-2">
                Enchantement scellé !
              </h2>
              <p className="text-sm font-semibold text-slate-200 mb-3">
                Votre livre est parti pour l'impression !
              </p>
              <div className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6 space-y-2">
                <p>
                  Un reçu de confirmation vient d'être dépêché à l'adresse <b>{email}</b>.
                </p>
                <p>
                  Nos lutins imprimeurs vont relier durablement votre livre de prestige avec tout leur savoir-faire artisanal. Expédition sous 48h vers l'adresse <b>{address}, {city}</b>.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/60 flex items-center gap-3 text-left w-full mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="text-[10px] font-mono text-slate-300 uppercase leading-normal">
                  Statut de l'ordonnance : <span className="text-emerald-400 font-bold">Impression en attente (48h)</span>
                </div>
              </div>

              <button
                id="close_success_modal_btn"
                onClick={() => {
                  onClose();
                  setIsSuccess(false);
                  setEmail('');
                  setAddress('');
                  setCity('');
                  setCardNumber('');
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-all cursor-pointer"
              >
                Retourner à mon livre magique
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
