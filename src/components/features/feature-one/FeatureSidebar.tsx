/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import shop_data from "@/data/ShopData";
import { selectProducts } from "@/redux/features/productSlice";
import { useReducer } from "react";
import { useSelector } from "react-redux";
import { Rating } from 'react-simple-star-rating';
import PriceRange from "./PriceRange";
import { FilterSidebarListItem } from "@/components/common/FilterSidebarListItem";

interface FilterCriteria {
  category: string;
  amenities: string;
  language: string;
  rating: number | null;
  searchQuery: string;
}

type SidebarFilterState = FilterCriteria & {
  priceValue: [number, number];
};

type SidebarFilterAction =
  | { type: 'toggleCategory'; category: string }
  | { type: 'toggleAmenities'; amenities: string }
  | { type: 'toggleLanguage'; language: string }
  | { type: 'toggleRating'; rating: number }
  | { type: 'setSearchQuery'; searchQuery: string }
  | { type: 'setPriceValue'; priceValue: number[] }
  | { type: 'reset'; maxPrice: number };

const createInitialFilterState = (maxPrice: number): SidebarFilterState => ({
  category: '',
  amenities: '',
  language: '',
  rating: null,
  searchQuery: '',
  priceValue: [0, maxPrice],
});

function sidebarFilterReducer(
  state: SidebarFilterState,
  action: SidebarFilterAction,
): SidebarFilterState {
  switch (action.type) {
    case 'toggleCategory':
      return {
        ...state,
        category: state.category === action.category ? '' : action.category,
      };
    case 'toggleAmenities':
      return {
        ...state,
        amenities: state.amenities === action.amenities ? '' : action.amenities,
      };
    case 'toggleLanguage':
      return {
        ...state,
        language: state.language === action.language ? '' : action.language,
      };
    case 'toggleRating':
      return {
        ...state,
        rating: state.rating === action.rating ? null : action.rating,
      };
    case 'setSearchQuery':
      return { ...state, searchQuery: action.searchQuery };
    case 'setPriceValue':
      return {
        ...state,
        priceValue: [action.priceValue[0], action.priceValue[1]],
      };
    case 'reset':
      return createInitialFilterState(action.maxPrice);
    default:
      return state;
  }
}

interface FeatureSidebarProps {
  setProducts: (products: any[]) => void;
}

const FeatureSidebar = ({ setProducts }: FeatureSidebarProps) => {
  const allProducts = useSelector(selectProducts);
  const filterdProduct = allProducts.filter(product => product.page === 'shop_1');

  const maxPrice = shop_data.reduce((max, item) => {
    return item.price > max ? item.price : max;
  }, 0);

  const [filter, dispatch] = useReducer(
    sidebarFilterReducer,
    maxPrice,
    createInitialFilterState,
  );

  const categoryFilter = filterdProduct.map(product => product.category);
  const amenitiesFilter = filterdProduct.map(product => product.amenities);
  const languageFilter = filterdProduct.map(product => product.language);

  const allCategory = ['All Property Type', ...new Set(categoryFilter)];
  const allAmenities = ['All Amenities', ...new Set(amenitiesFilter)];
  const allLanguage = ['All Language', ...new Set(languageFilter)];

  const filterProducts = ({
    category,
    amenities,
    language,
    rating,
    searchQuery,
  }: FilterCriteria) => {
    let filteredProducts = allProducts;

    if (searchQuery.trim()) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category && category !== 'All Property Type') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (amenities && amenities !== 'All Amenities') {
      filteredProducts = filteredProducts.filter(product => product.amenities === amenities);
    }

    if (language && language !== 'All Language') {
      filteredProducts = filteredProducts.filter(product => product.language === language);
    }

    if (rating !== null) {
      filteredProducts = filteredProducts.filter(product => product.review === rating);
    }

    setProducts(filteredProducts);
  };

  const applyPriceFilter = (priceValue: number[]) => {
    const filterPrice = shop_data.filter(
      (item) => item.price >= priceValue[0] && item.price <= priceValue[1],
    );
    setProducts(filterPrice);
  };

  const handleCategory = (category: string) => {
    const next = sidebarFilterReducer(filter, { type: 'toggleCategory', category });
    dispatch({ type: 'toggleCategory', category });
    filterProducts(next);
  };

  const handleAmenities = (amenities: string) => {
    const next = sidebarFilterReducer(filter, { type: 'toggleAmenities', amenities });
    dispatch({ type: 'toggleAmenities', amenities });
    filterProducts(next);
  };

  const handleLanguage = (language: string) => {
    const next = sidebarFilterReducer(filter, { type: 'toggleLanguage', language });
    dispatch({ type: 'toggleLanguage', language });
    filterProducts(next);
  };

  const handleRating = (rating: number) => {
    const next = sidebarFilterReducer(filter, { type: 'toggleRating', rating });
    dispatch({ type: 'toggleRating', rating });
    filterProducts(next);
  };

  const handleChanges = (val: number[]) => {
    dispatch({ type: 'setPriceValue', priceValue: val });
    applyPriceFilter(val);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(filter.searchQuery.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleResetAll = () => {
    dispatch({ type: 'reset', maxPrice });
    setProducts(filterdProduct);
  };

  return (
    <div className="col-xl-3 col-lg-4 order-last order-lg-first">
      <div className="tg-filter-sidebar mb-40 top-sticky">
        <div className="tg-filter-item">
          <div className="d-flex justify-content-between align-items-center mb-10">
            <h4 className="tg-filter-title mb-0">Search</h4>
            <button type="button" className="tg-filter-reset" onClick={handleResetAll}>
              Reset All
            </button>
          </div>
          <div className="tg-filter-search-form">
            <form onSubmit={handleFormSubmit} className="p-relative">
              <input aria-label="Search Hotel"
                className="input"
                type="text"
                placeholder="Search Hotel"
                value={filter.searchQuery}
                onChange={(e) =>
                  dispatch({ type: 'setSearchQuery', searchQuery: e.target.value })
                }
              />
              <button className="buttons" type="submit" aria-label="Search">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_397_1228)">
                    <path d="M13.22 13.22L10.52 10.52M12.20 6.49C12.20 9.64 9.64 12.20 6.49 12.20C3.33 12.20 0.78 9.64 0.78 6.49C0.78 3.33 3.33 0.78 6.49 0.78C9.64 0.78 12.20 3.33 12.20 6.49Z" stroke="#353844" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_397_1228">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </form>
          </div>
          <span className="tg-filter-border mt-30 mb-25"></span>

          <h4 className="tg-filter-title mb-15">Property Type</h4>
          <div className="tg-filter-list">
            <ul>
              {allCategory.map((category, i) => (
                <FilterSidebarListItem key={category} onSelect={() => handleCategory(category)}>
                  <div className="checkbox d-flex">
                    <input className="tg-checkbox" type="checkbox" checked={category === filter.category} readOnly id={`cat_${i}`} aria-label={category} />
                    <label htmlFor={`cat_${i}`} className="tg-label">{category}</label>
                  </div>
                </FilterSidebarListItem>
              ))}
            </ul>
          </div>
          <span className="tg-filter-border mt-25 mb-25"></span>

          <div className="tg-filter-price-input">
            <h4 className="tg-filter-title mb-20">Price By Filter</h4>
            <PriceRange
              MAX={maxPrice}
              MIN={0}
              STEP={1}
              values={filter.priceValue}
              handleChanges={handleChanges}
            />
            <div className="d-flex align-items-center mt-15">
              <span className="input-range">
                ${filter.priceValue[0]} - ${filter.priceValue[1]}
              </span>
            </div>
          </div>
          <span className="tg-filter-border mt-25 mb-25"></span>

          <h4 className="tg-filter-title mb-15">Amenities</h4>
          <div className="tg-filter-list">
            <ul>
              {allAmenities.map((amenities, i) => (
                <FilterSidebarListItem key={amenities} onSelect={() => handleAmenities(amenities)}>
                  <div className="checkbox d-flex">
                    <input className="tg-checkbox" type="checkbox" checked={amenities === filter.amenities} readOnly id={`amenities_${i}`} aria-label={amenities} />
                    <label className="tg-label" htmlFor={`amenities_${i}`}>{amenities}</label>
                  </div>
                </FilterSidebarListItem>
              ))}
            </ul>
          </div>
          <span className="tg-filter-border mt-25 mb-25"></span>

          <h4 className="tg-filter-title mb-15">Top Reviews</h4>
          <div className="tg-filter-list">
            <ul>
              {[5, 4, 3, 2, 1].map((rating, i) => (
                <FilterSidebarListItem key={rating} onSelect={() => handleRating(rating)}>
                  <div className="checkbox d-flex">
                    <input className="tg-checkbox" type="checkbox" checked={rating === filter.rating} readOnly id={`rating_${i}`} aria-label={`${rating} stars`} />
                    <label htmlFor={`rating_${i}`}>
                      <div className="tg-filter-review">
                        <Rating initialValue={rating} size={18} readonly />
                      </div>
                    </label>
                  </div>
                </FilterSidebarListItem>
              ))}
            </ul>
          </div>
          <span className="tg-filter-border mt-25 mb-25"></span>

          <h4 className="tg-filter-title mb-15">Language</h4>
          <div className="tg-filter-list">
            <ul>
              {allLanguage.map((language, i) => (
                <FilterSidebarListItem key={language} onSelect={() => handleLanguage(language)}>
                  <div className="checkbox d-flex">
                    <input className="tg-checkbox" type="checkbox" checked={language === filter.language} readOnly id={`language_${i}`} aria-label={language} />
                    <label className="tg-label" htmlFor={`language_${i}`}>{language}</label>
                  </div>
                </FilterSidebarListItem>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSidebar
