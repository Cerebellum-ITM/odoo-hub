import Odoo from "odoo-await";
import { getPreferenceValues } from "@raycast/api";

class OdooServise {
    private odooInstance: Odoo


    constructor() {
        const preferences = getPreferenceValues<Preferences>()
        this.odooInstance = new Odoo(
            {
                baseUrl: preferences.base_url,
                port: undefined,
                db: preferences.db,
                username: preferences.username,
                password: preferences.password
            }
        )
    }

    async connect() {
        try {
            await this.odooInstance.connect();
        } catch (error) {
            console.error("Error connecting to Odoo:", error);
        }
    }

    async createPartner(name: string, email: string) {
        try {
            const partnerId = await this.odooInstance.create("res.partner", {
                name,
                email
            });
            console.log(`Partner created with ID ${partnerId}`);
            return partnerId;
        } catch (error) {
            console.error("Error creating partner:", error);
        }
    }

    async getPartnes() {
        try {
            const partnerIds = await this.odooInstance.searchRead('res.partner', [['name', '=', 'Kool Keith']], ["id", 'name'], { limit: 10 })
            return partnerIds;
        }
        catch (error) {
            console.error('An error was encountered while trying to get the contacts:', error)
        }
    }

}

export default OdooServise;
