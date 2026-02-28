type Props = {
  params: {
    slug: string;
  };
};

export default function ResultDetailPage({ params }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Result: {params.slug}</h1>
      <p className="text-lg mt-4">Result detail page</p>
    </div>
  );
}
