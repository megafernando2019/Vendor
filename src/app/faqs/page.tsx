"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import DEFAULT_FAQ_DATA from "@/src/data/FaqData";
import type {
  FAQData,
  FAQQuestions,
  FrequentlyAskedQuestionsProps,
} from "@/src/interfaces/ui";

function getFaqCategories(data: FAQData): string[] {
  return Object.keys(data).filter((key) => key !== "Iconos");
}

function getCategoryQuestions(data: FAQData, category: string): FAQQuestions {
  const content = data[category];
  if (!content || category === "Iconos") return {};
  return content as FAQQuestions;
}

type FAQSearchResult = {
  category: string;
  question: string;
  answer: string;
};

function searchFaqQuestions(data: FAQData, query: string): FAQSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const results: FAQSearchResult[] = [];

  for (const category of getFaqCategories(data)) {
    const questions = getCategoryQuestions(data, category);
    for (const [question, answer] of Object.entries(questions)) {
      if (
        question.toLowerCase().includes(normalized) ||
        answer.toLowerCase().includes(normalized)
      ) {
        results.push({ category, question, answer });
      }
    }
  }

  return results;
}

function resultKey(result: FAQSearchResult): string {
  return `${result.category}::${result.question}`;
}

export default function FrequentlyAskedQuestions({
  data = DEFAULT_FAQ_DATA,
}: FrequentlyAskedQuestionsProps) {
  const categories = useMemo(() => getFaqCategories(data), [data]);
  const [selectedCategory, setSelectedCategory] = useState(
    () => categories[0] ?? "General",
  );
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedSearch = searchQuery.trim();
  const isSearching = trimmedSearch.length > 0;

  const searchResults = useMemo(
    () => searchFaqQuestions(data, searchQuery),
    [data, searchQuery],
  );

  const categoryQuestions = getCategoryQuestions(data, selectedCategory);

  const displayedQuestions: FAQSearchResult[] = isSearching
    ? searchResults
    : Object.entries(categoryQuestions).map(([question, answer]) => ({
        category: selectedCategory,
        question,
        answer,
      }));

  const selectedAnswer = useMemo(() => {
    if (!selectedQuestion) return null;
    if (isSearching) {
      return (
        searchResults.find((item) => resultKey(item) === selectedQuestion)
          ?.answer ?? null
      );
    }
    return categoryQuestions[selectedQuestion] ?? null;
  }, [selectedQuestion, isSearching, searchResults, categoryQuestions]);

  const toggleQuestion = (item: FAQSearchResult) => {
    const key = isSearching ? resultKey(item) : item.question;
    setSelectedQuestion((prev) => (prev === key ? null : key));
  };

  const handleCategorySelect = (categoria: string) => {
    setSearchQuery("");
    setSelectedCategory(categoria);
    setSelectedQuestion(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedQuestion(null);
  };

  const contactFooter = (
    <div className="mt-4 mt-md-auto text-center text-md-end">
      <h3 className="faq-contact-footer small fw-semibold border-top pt-3 mb-0">
        <Image
          src="/icons/callCenter.svg"
          alt=""
          width={50}
          height={50}
          className="object-fit-contain d-inline-block align-middle me-2"
        />
        ¿No encontraste lo que buscabas? Nuestro equipo está listo para
        ayudarte, contácta un asesor
      </h3>
    </div>
  );

  return (
    <section className="tg-faqs-page container-fluid py-4 px-3 px-md-4">
      <div className="row g-4 align-items-start mb-4">
        <div className="col-12 col-md-6">
          <h2 className="fs-3 fw-bold mb-3 text-secondary">
            Preguntas Frecuentes FAQ
          </h2>
          <span className="text-muted">
            Encuentra respuestas rápidas a tus dudas.
          </span>
        </div>
        <div className="col-12 col-md-6 min-w-0">
          <label htmlFor="buscar-faqs" className="visually-hidden">
            Busca preguntas, temas palabras clave
          </label>
          <input
            id="buscar-faqs"
            type="search"
            className="form-control form-control-lg faq-search-input"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Busca preguntas, temas palabras clave.."
            aria-label="Busca preguntas, temas palabras clave"
          />
        </div>
      </div>

      <div className="row g-3 tg-faqs-main-row">
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow h-100 tg-faqs-panel">
            <div className="card-body p-3 p-md-4">
              <ul className="list-unstyled mb-0 d-flex flex-wrap flex-md-column gap-2 faq-category-list">
                {categories.map((categoria) => {
                  const iconSrc = data.Iconos[categoria];
                  const questionCount = Object.keys(
                    getCategoryQuestions(data, categoria),
                  ).length;
                  const isSelected =
                    !isSearching && selectedCategory === categoria;

                  return (
                    <li key={categoria} className="faq-category-item">
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(categoria)}
                        aria-pressed={isSelected}
                        className={`btn faq-category-btn w-100 d-inline-flex align-items-center gap-2 ${
                          isSelected ? "active" : ""
                        }`}
                      >
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt=""
                            width={20}
                            height={20}
                            className="flex-shrink-0 object-fit-contain faq-category-icon"
                          />
                        ) : null}
                        <span className="text-nowrap">{categoria}</span>
                        <span
                          className="faq-category-count ms-md-auto"
                          aria-label={`${questionCount} preguntas`}
                        >
                          {questionCount}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow h-100 tg-faqs-panel">
            <div className="card-body p-3 p-md-4">
              <div className="mb-3">
                <h2 className="h5 text-morado-custom mb-0">
                  {isSearching ? (
                    <>
                      Búsqueda:{" "}
                      <span className="fw-semibold faq-accent-text">
                        {trimmedSearch}
                      </span>
                    </>
                  ) : (
                    selectedCategory
                  )}
                </h2>
              </div>

              {displayedQuestions.length === 0 ? (
                <p className="small text-muted fst-italic mb-0">
                  {isSearching
                    ? "No se encontraron preguntas para esta búsqueda."
                    : "No hay preguntas en esta categoría."}
                </p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {displayedQuestions.map((item) => {
                    const itemKey = isSearching
                      ? resultKey(item)
                      : item.question;
                    const isOpen = selectedQuestion === itemKey;

                    return (
                      <div key={itemKey} className="w-100">
                        <button
                          type="button"
                          onClick={() => toggleQuestion(item)}
                          aria-expanded={isOpen}
                          className={`btn faq-question-btn w-100 text-start ${
                            isOpen ? "active" : ""
                          }`}
                        >
                          {item.question}
                        </button>

                        {isOpen && (
                          <div className="d-md-none faq-answer-mobile p-3 small">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-5 d-none d-md-flex flex-column">
          <div className="card border-0 shadow flex-grow-1 tg-faqs-panel tg-faqs-answers-panel">
            <div className="card-body p-4 d-flex flex-column h-100">
              <h2 className="h5 text-morado-custom mb-3">Respuestas</h2>
              {selectedAnswer ? (
                <div className="mx-auto text-center" style={{ maxWidth: "28rem" }}>
                  <p className="text-secondary small text-start p-3 mb-0">
                    {selectedAnswer}
                  </p>
                </div>
              ) : (
                <p className="text-muted text-center mb-0">
                  Selecciona una pregunta para ver la respuesta.
                </p>
              )}
              {contactFooter}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
