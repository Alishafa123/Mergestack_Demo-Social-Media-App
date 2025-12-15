import { useAtomValue } from 'jotai';
import { userAtom } from '../../jotai/user.atom';
import Navbar from '../../components/navbar/Navbar';

export default function Dashboard() {
  const user = useAtomValue(userAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">
            Working on it, will be live soon! 🚀
          </h1>
          <p className="text-gray-500">
            Dashboard content is coming...
          </p>
        </div>
      </main>
    </div>
  );
}