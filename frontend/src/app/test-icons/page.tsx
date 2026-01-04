
import Image from 'next/image';

const icons = [
  'Architecture-Service-Icons_07312025/Arch_Analytics/48/Arch_Amazon-Athena_48.svg',
  'Architecture-Service-Icons_07312025/Arch_Analytics/48/Arch_Amazon-CloudSearch_48.svg',
  'Architecture-Service-Icons_07312025/Arch_Analytics/48/Arch_Amazon-Data-Firehose_48.svg',
];

export default function TestIconsPage() {
  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">AWS Icon Verification</h1>
      <div className="grid grid-cols-4 gap-8">
        {icons.map((path) => (
          <div key={path} className="flex flex-col items-center gap-2 border p-4 rounded-lg">
            <Image
              src={`/aws-icons/${path}`}
              alt={path}
              width={48}
              height={48}
            />
            <p className="text-xs text-muted-foreground break-all text-center">{path.split('/').pop()}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Assets loaded from <code>/public/aws-icons</code>
      </p>
    </div>
  );
}
