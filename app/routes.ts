import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/company", "routes/company.tsx"),
  route("/portfolio", "routes/portfolio.tsx"),
  route("/contacts", "routes/contacts.tsx"),
  route("/vacancies", "routes/vacancies.tsx"),
  route("/services", "routes/services.tsx"),
  route("/service/:id", "routes/service-detail.tsx"),
  route("/proposal", "routes/proposal.tsx"),
  route("/drone-defense", "routes/drone-defense.tsx"),
  route("/privacy", "routes/privacy.tsx"),
  route("/terms", "routes/terms.tsx")
] satisfies RouteConfig;
