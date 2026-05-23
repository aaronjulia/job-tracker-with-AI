

export default function ContactsSection({ applicationId }: { applicationId: string }) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Contacts</h2>
            <p>Contact management coming soon! (Application ID: {applicationId})</p>
        </div>
    );
}