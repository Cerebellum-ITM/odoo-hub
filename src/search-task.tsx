import { ActionPanel, Detail, List, Action, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import OdooService from "./lib/odoo";

export default function Command() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [odooService, setOdooService] = useState<OdooService | null>(null);
    const [partnersFetched, setPartnersFetched] = useState(false);

    useEffect(() => {
        const servise = new OdooService();

        const connect = async () => {
            try {
                await servise.connect();
                setOdooService(servise)
            } catch (err) {
                setError("Error connecting to Odoo or creating partner.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        connect();
    }, []);

    useEffect(() => {
        if (odooService && !partnersFetched) {
            const fetchPartners = async () => {
                try {
                    const partners = await odooService.getPartnes()
                    setPartnersFetched(true);
                    console.log(partners);
                } catch (err) {
                    console.error("Error fetching partners:", err);
                }
            };

            fetchPartners();
        }
    }, [odooService, partnersFetched]);



    if (loading) {
        return <List isLoading />;
    }

    if (error) {
        return (
            <List>
                <List.Item
                    icon={Icon.Xmark}
                    title="Error"
                    subtitle={error}
                    actions={
                        <ActionPanel>
                            <Action title="Retry" onAction={() => {
                                setLoading(true);
                                setError(null);
                            }} />
                        </ActionPanel>
                    }
                />
            </List>
        );
    }

    return (
        <List>
            <List.Item
                icon={Icon.Checkmark}
                title="Partner Created"
                subtitle={`Partner ID:`}
                actions={
                    <ActionPanel>
                        <Action.Push title="Show Details" target={<Detail markdown={``} />} />
                    </ActionPanel>
                }
            />
        </List>
    );
}

