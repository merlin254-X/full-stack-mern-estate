import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                setLandlord(data);
            } catch (error) {
                console.error('Error fetching landlord:', error);
            }
        };

        fetchLandlord();
    }, [listing.userRef]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact <span className="font-semibold">{landlord.username}</span> for{' '}
                        <span className="font-semibold">{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Enter your message here..."
                        className="w-full border p-3 rounded-lg"
                    ></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}