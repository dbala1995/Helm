import backgroundImage from "../../version/images/Artboard.png"
import cardBackgroundImage from "../../version/images/blue-ring-01.png"
import tableHeaderImage from "../../version/images/table-header.png"

import ThemeTopbar from "../common/Topbar"
import PatientSummary from "../../core/pages/PatientSummary"

export const themeShortMenu = [
  { url: "/summary", label: "Patient Summary" },
  { url: "/what-matters-to-me", label: "What Matters to me?" },
  { url: "/measurements", label: "Measurements" },
  // { url: "/top3Things", label: "TopThreeThings" },
  { url: "/leeds-information", label: "Leeds Information" },
  { url: "/nhs-resources", label: "NHS Resources" },
]

export const themeFullMenu = [
  { url: "/summary", label: "Patient Summary" },
  { url: "/what-matters-to-me", label: "What Matters to me?" },
  { url: "/measurements", label: "Measurements" },
  // { url: "/top3Things", label: "TopThreeThings" },
  { url: "/leeds-information", label: "Leeds Information" },
  { url: "/nhs-resources", label: "NHS Resources" },
]

export const themeCommonElements = {
  topbar: ThemeTopbar,
  homePage: PatientSummary,
  isFooterAbsent: true,
}

export const themeImages = {
  backgroundImage: backgroundImage,
  cardBackgroundImage: cardBackgroundImage,
  tableHeaderImage: tableHeaderImage,
}
