// place this in the sidebar later
import { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './NeedHelp.module.css';
import plantImg from '../../assets/needhelpplant.webp';
import plantImg2x from '../../assets/needhelpplant@2.webp';

export default function NeedHelp() {
    const [isOpen, setIsOpen] = useState(false);
    const [fromEmail, setFromEmail] = useState('');
    const [fromName, setFromName] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const resetForm = useCallback(() => {
        setFromEmail('');
        setFromName('');
        setMessage('');
        setStatus('idle');
        setErrorMsg('');
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        resetForm();
    }, [resetForm]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeModal]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
        const res = await fetch('/help', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromEmail, fromName, message }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Something went wrong.');
        }

        setStatus('success');
        } catch (err) {
        setStatus('error');
        setErrorMsg(err.message);
        }
    };

    return (
        <>
            <div className={styles.needhelpsidebar}>
                <img className={styles.plant} srcSet={`${plantImg} 1x, ${plantImg2x} 2x`} src={plantImg} alt="plant image" />
                <p>If you need help with <span className={styles.taskpro}>TaskPro</span>, check out our support resources or reach out to our customer support team.</p>
                <div className={styles.needhelptrigger} onClick={() => setIsOpen(true)}>
                    <svg className={styles.helpcircle}>
                        <use href="/symbol-defs.svg#icon-help-circle"></use>
                    </svg>
                    <p>Need help?</p>
                </div>
            </div>

        {isOpen && createPortal(
            <div className={styles.modal} onClick={closeModal}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closepopup} onClick={closeModal}>
                    <svg className={styles.closeicon}>
                        <use href="/symbol-defs.svg#icon-close"></use>
                    </svg>
                </button>

                {status === 'success' ? (
                <div>
                    <h2>Message sent!</h2>
                    <p>We'll get back to you soon.</p>
                    <button onClick={closeModal}>Close</button>
                </div>
                ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>Need help?</h2>

                    <label htmlFor="email">
                        <input
                        type="email"
                        name="email"
                        id="email"
                        value={fromEmail}
                        placeholder="Email address"
                        required
                        onChange={(e) => setFromEmail(e.target.value)}
                        />
                    </label>

                    <label htmlFor="message">
                        <textarea
                        required
                        id="message"
                        value={message}
                        placeholder="Comment"
                        onChange={(e) => setMessage(e.target.value)}
                        />
                    </label>

                    {status === 'error' && <p className={styles.errortext}>{errorMsg}</p>}

                    <button className={styles.sendbutton} type="submit">Send
                    {/* {status === 'sending' ? 'Sending...' : 'Send message'} */}
                    </button>
                </form>
                )}
            </div>
            </div>,
            document.body,
        )}
    </>
  );
}
