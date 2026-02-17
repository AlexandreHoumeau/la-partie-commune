import { Agency } from "./agency";
import { Profile } from "./profile";

export type AuthUserContext = Profile & {
    agency: Agency;
};