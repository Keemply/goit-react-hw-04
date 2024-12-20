import { createContext, useContext, useState } from "react";
import getPhotos from "./unsplashApi";
import { useEffect } from "react";
const searchContext = createContext();

export const useSearch = () => useContext(searchContext);

export const SearchProvider = ({ children }) => {
  const [firstSearch, setFirstSearch] = useState("");
  const [firstObj, setFirstObj] = useState("");
  const [counter, setCounter] = useState(1);
  const [total_pages, setTotal_pages] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState({});

  function getSearchQuery(val) {
    setFirstSearch(val);
    setCounter(1);
    setFirstObj("");
    setTotal_pages(0);
  }
  useEffect(() => {
    if (firstSearch !== "") {
      async function wrapper() {
        try {
          setLoaderVisible(true);
          const result = await getPhotos(firstSearch, counter);
          setLoaderVisible(false);
          setTotal_pages(result.total_pages);
          setFirstObj((pref) => {
            return [...pref, ...result.results];
          });
        } catch (error) {
          setLoaderVisible(false);
          setShowError(true);
        }
      }
      wrapper();
    }
  }, [firstSearch, counter]);
  function loadMoreHandler() {
    setCounter((pref) => pref + 1);
  }
  return (
    <searchContext.Provider
      value={{
        firstSearch,
        getSearchQuery,
        setFirstObj,
        firstObj,
        loadMoreHandler,
        loaderVisible,
        setLoaderVisible,
        showError,
        setShowError,
        counter,
        total_pages,
        setTotal_pages,
        modalIsOpen,
        setModalIsOpen,
        setCurrentImg,
        currentImg,
      }}
    >
      {children}
    </searchContext.Provider>
  );
};
