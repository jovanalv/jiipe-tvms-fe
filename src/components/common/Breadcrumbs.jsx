import { Link, useLocation } from "react-router-dom";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";

const Breadcrumbs = ({
  items,
  isEdit,
  isCreate,
  isDetailParam,
  isDetail,
  manualItems,
  customTitle,
}) => {
  const { name1, group_name, menuid } = useBreadcrumb();
  const location = useLocation();

  const displayedTitle = customTitle || name1;

  if (manualItems) {
    return (
      <div className="py-4">
        {/* <h1 className="mb-2 text-2xl font-bold text-primary">
          {displayedTitle}
        </h1> */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {manualItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="pr-2 text-gray-40">/</span>
                )}
                {index === manualItems.length - 1 ? (
                  <span className=" text-gray-700">
                    {item.name}
                  </span>
                ) : item.path ? (
                  <Link
                    to={item.path}
                    className="font-semibold transition-all hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-700">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  }

  const data = items || {
    title: displayedTitle,
    items: isEdit
      ? [
          { name: group_name },
          { name: name1, path: `/${menuid}` },
          { name: "Edit", path: location.pathname },
        ]
      : isCreate
        ? [
            { name: group_name },
            { name: name1, path: `/${menuid}` },
            { name: `Create ${name1}`, active: true },
          ]
        : isDetailParam
          ? [
              { name: group_name },
              { name: name1, path: `/${menuid}` },
              { name: isDetailParam, active: true },
            ]
          : isDetail
            ? [
                { name: group_name },
                { name: name1, path: `/${menuid}` },
                { name: "Detail", path: location.pathname },
              ]
            : [
                { name: group_name, path: `/${menuid}` },
                { name: name1, path: `/${menuid}` },
              ],
  };

  return (
    <div className="py-4">
      {/* <h1 className="mb-2 text-2xl font-bold text-primary">{displayedTitle}</h1> */}
      <nav aria-label="breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {data?.items?.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="pr-2 text-gray-40">/</span>
              )}
              {index === data.items.length - 1 ? (
                <span className="font-semibold hover:text-blue-600">
                  {item.name || ""}
                </span>
              ) : item.path ? (
                <Link to={item.path} className=" transition-all">
                  {item.name || "Dashboard"}
                </Link>
              ) : (
                <span className="font-semibold text-gray-700">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;