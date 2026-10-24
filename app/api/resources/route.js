const resources = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title:
    [
      "Classroom Management",
      "Teaching Mathematics",
      "Lesson Planning",
      "Student Assessment",
      "Digital Learning",
    ][index % 5] + ` - Resource ${index + 1}`,
  description: `Practical teaching resource number ${index + 1}.`,
}));

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = (searchParams.get("search") || "").trim().toLowerCase();

  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  const pageSize = 5;

  const filteredResources = resources.filter((resource) =>
    `${resource.title} ${resource.description}`.toLowerCase().includes(search),
  );

  const total = filteredResources.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return Response.json({
    resources: filteredResources.slice(start, start + pageSize),
    page: currentPage,
    pageSize,
    total,
    totalPages,
  });
}
