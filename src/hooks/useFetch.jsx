import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const useFetch = ({
  fetchFn,
  deps = [],
  additionalFetches,
  transform,
  defaultQueryParams,
  isUseWebQueryParam = true,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parseParams = () => {
    const urlParams = isUseWebQueryParam
      ? Object.fromEntries(searchParams.entries())
      : {};
    return {
      ...defaultQueryParams,
      ...urlParams,
    };
  };

  const searchDebounceTimeout = useRef(null);
  const initialParams = parseParams();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialParams.search || "");
  const [queryParams, setQueryParams] = useState(initialParams);
  const [filterData, setFilterData] = useState(initialParams);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [pageIndex, setPageIndexState] = useState(0);
  const [pageSize, setPageSizeState] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const loadData = useCallback(
    async (
      newPageIndex = pageIndex,
      newPageSize = pageSize,
      isPaging = false,
      overrideParams,
      isDisplayLoading = true
    ) => {
      if (isDisplayLoading) {
        isPaging ? setIsChangingPage(true) : setLoading(true);
      }
      setIsFetching(true);

      try {
        const updatedQuery = { ...queryParams, ...overrideParams };

        const filteredQuery = Object.fromEntries(
          Object.entries(updatedQuery).filter(([_, v]) => v != null && v !== "")
        );

        if (isUseWebQueryParam) {
          setSearchParams(filteredQuery);
        }

        if (filteredQuery) {
          setQueryParams({ ...filteredQuery });
          setFilterData({ ...filteredQuery });
        }

        const [res] = await Promise.all([
          fetchFn(newPageIndex, newPageSize, filteredQuery),
          !isPaging && additionalFetches
            ? additionalFetches()
            : Promise.resolve(),
        ]);

        const transformedData = transform
          ? transform(res.data ?? [])
          : res.data ?? [];

        setData(transformedData);
        setTotalRecords(res.totalRecords);
        setPageCount(res.totalPages);
        setPageIndexState(newPageIndex);
        setPageSizeState(newPageSize);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
        setIsChangingPage(false);
        setIsFetching(false);
      }
    },
    [
      fetchFn,
      pageIndex,
      pageSize,
      additionalFetches,
      transform,
      queryParams,
      setSearchParams,
      isUseWebQueryParam,
    ]
  );

  useEffect(() => {
    loadData(pageIndex, pageSize, false);
  }, deps);

  const reload = () => {
    loadData(pageIndex, pageSize, true, {}, false);
  };

  const reloadDisplay = () => {
    loadData(pageIndex, pageSize, true, {}, true);
  };

  const runLoadData = (newPageIndex, newPageSize, isPaging, overrideParams) => {
    loadData(
      newPageIndex ?? pageIndex,
      newPageSize ?? pageSize,
      isPaging ?? false,
      overrideParams
    );
  };

  const handleSearch = useCallback(
    (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);

      if (searchDebounceTimeout.current) {
        clearTimeout(searchDebounceTimeout.current);
      }

      searchDebounceTimeout.current = setTimeout(() => {
        loadData(0, pageSize, true, { search: term });
      }, 350);
    },
    [loadData, pageSize]
  );

  return {
    data,
    loading,
    error,
    setError,
    pageIndex,
    pageSize,
    pageCount,
    totalRecords,
    isChangingPage,
    setData,
    setPageIndex: (page) => loadData(page, pageSize, true),
    setPageSize: (size) => loadData(0, size, true),
    queryParams,
    filterData,
    setFilterData,
    searchTerm,
    handleSearch,
    reload,
    reloadDisplay,
    loadData: runLoadData,
    isFetching,
  };
};
