import { Complaint, PrismaClient } from '@prisma/client';
import Link from 'next/link';

const FeedImage: React.FC<{ url: string; id: string }> = ({ url, id }) => {
  return (
    <div>
      <Link href={`/complaint/${id}`}>
        <img
          style={{ height: 400, objectFit: 'cover', textAlign: 'center', borderRadius: '4%' }}
          src={`/api/complaint/images/download?url=${url}`}
          loading="lazy"
        />
      </Link>
    </div>
  );
};

const Feed: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh', gap: 20 }}>
      <h1>Feed</h1>

      {complaints.map((complaint) => (
        <div
          key={complaint.complaintId}
          style={{
            margin: '8px 0',
            border: 1,
            gap: 30,
            display: 'flex',
          }}
        >
          <div>
            {complaint.images.length > 0 && <FeedImage url={complaint.images[0]} id={complaint.complaintId} />}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <span>{complaint.title}</span>
              <span>{complaint.content}</span>
            </div>
          </div>
        </div>
      ))}

      <Link style={{ marginTop: 50 }} href="/complaint/create">
        Create a new complaint
      </Link>
    </div>
  );
};

export default Feed;

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const complaints = await prisma.complaint.findMany();

  const postsToReturn = complaints.map((complaint) => ({
    ...complaint,
    createdAt: complaint.createdAt.toISOString(),
  }));

  return {
    props: {
      complaints: postsToReturn,
    }, // will be passed to the page component as props
  };
}
