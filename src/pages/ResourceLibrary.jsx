import React, { useState } from "react";
import Swal from 'sweetalert2';

// Extended dummy data for resources with topics and detailed content
const resourcesData = [
  { id: 1, title: "Calculus - Differentiation", type: "📄", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "Math", content: "Introduction to differentiation, covering limits, derivatives, and real-world applications." },
  { id: 2, title: "Physics - Newton's Laws", type: "🎬", link: "https://www.w3schools.com/html/mov_bbb.mp4", subject: "Science", content: "An overview of Newton's three laws of motion with real-life examples and demonstrations." },
  { id: 3, title: "Linear Algebra - Matrices", type: "📝", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "Math", content: "A detailed guide to matrices, matrix operations, and their applications in computer science." },
  { id: 4, title: "History - World War I", type: "📄", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "History", content: "An analysis of the causes, major events, and impact of World War I." },
  { id: 5, title: "Biology - Cell Structure", type: "🎬", link: "https://www.w3schools.com/html/mov_bbb.mp4", subject: "Science", content: "A video explaining the structure of animal and plant cells, including organelles and their functions." },
  { id: 6, title: "Geometry - Shapes and Properties", type: "📝", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "Math", content: "A comprehensive article on various geometric shapes, their properties, and real-world uses." },
  { id: 7, title: "History - The Cold War", type: "📄", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "History", content: "A deep dive into the Cold War, its origins, key events, and aftermath." },
  { id: 8, title: "Chemistry - Atomic Theory", type: "🎬", link: "https://www.w3schools.com/html/mov_bbb.mp4", subject: "Science", content: "A video explaining the history and concepts of atomic theory, from Dalton to modern quantum mechanics." },
  { id: 9, title: "Algebra - Solving Equations", type: "📝", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "Math", content: "A step-by-step guide on solving linear equations and inequalities." },
  { id: 10, title: "History - Ancient Civilizations", type: "📄", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "History", content: "A historical exploration of ancient civilizations such as Egypt, Mesopotamia, and the Indus Valley." },
  { id: 11, title: "Chemistry - Periodic Table", type: "🎬", link: "https://www.w3schools.com/html/mov_bbb.mp4", subject: "Science", content: "A video introduction to the periodic table, its organization, and its significance in chemistry." },
  { id: 12, title: "Algebra - Quadratic Equations", type: "📝", link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", subject: "Math", content: "An article detailing the methods of solving quadratic equations, including factoring and the quadratic formula." },
];

export default function ResourceLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const handleFavoriteToggle = (resource) => {
    if (favorites.includes(resource.id)) {
      // Remove from favorites
      setFavorites(favorites.filter((id) => id !== resource.id)); 
      Swal.fire({
        title: 'Removed from Favorites',
        text: `${resource.title} has been removed from your favorites.`,
        icon: 'info',
        confirmButtonText: 'OK',
      });
    } else {
      // Add to favorites
      setFavorites([...favorites, resource.id]); 
      Swal.fire({
        title: 'Added to Favorites',
        text: `${resource.title} has been added to your favorites.`,
        icon: 'success',
        imageUrl: 'https://img.icons8.com/ios/452/like.png',  // Add custom heart icon (from Icons8)
        imageWidth: 50,
        imageHeight: 50,
        imageAlt: 'Heart Icon',
        confirmButtonText: 'OK',
      });
    }
  };

  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "All" ||
      resource.type === filterType ||
      (filterType === "Favorites" && favorites.includes(resource.id));
    const matchesSubject = filterSubject === "All" || resource.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  return (
    <div className="min-h-screen pt-6 pb-10 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1
        className="text-3xl font-semibold text-center text-blue-900 mt-6 mb-6"
        style={{
          textShadow: "0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        Resource Library
      </h1>

      {/* Search, Filter, and Subject Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-blue-400 p-2 w-full max-w-md bg-gray-100 text-blue-900 rounded-md shadow-sm"
          placeholder="Search resources..."
        />

        {/* Subject Filter Dropdown */}
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="border border-blue-400 p-2 w-full max-w-md bg-gray-100 text-blue-900 rounded-md shadow-sm"
        >
          <option value="All">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-blue-400 p-2 w-full max-w-md bg-gray-100 text-blue-900 rounded-md shadow-sm"
        >
          <option value="All">All Types</option>
          <option value="📄">PDF</option>
          <option value="🎬">Video</option>
          <option value="📝">Article</option>
          <option value="Favorites">Favorites</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 flex flex-col justify-between"
              style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div>
                <h2 className="text-lg font-medium mb-2 text-blue-900">{resource.title}</h2>
                <p className="mb-4 text-gray-600">Type: {resource.type}</p>
                <p className="mb-4 text-gray-600">Subject: {resource.subject}</p>
                <p className="text-gray-700 mb-4">{resource.content}</p>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  View
                </a>
                <button
                  onClick={() => handleFavoriteToggle(resource)}
                  className={`py-2 text-sm ${favorites.includes(resource.id) ? "text-red-500" : "text-gray-500"} hover:text-red-600`}
                >
                  {favorites.includes(resource.id) ? "Remove Favorite" : "Add Favorite"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No resources found. Try adjusting your search or filter.
          </p>
        )}
      </div>
    </div>
  );
}
