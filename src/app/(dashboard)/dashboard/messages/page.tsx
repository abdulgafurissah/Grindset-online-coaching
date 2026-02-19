import { getConversations, getContacts } from "@/app/actions/message";
import { auth } from "@/auth";
import { requireSubscription } from "@/lib/subscription-guard";
import ChatInterface from "./ChatInterface";

export default async function MessagesPage() {
    await requireSubscription();
    const session = await auth();
    const conversations = await getConversations();
    const allContacts = await getContacts();

    const currentUser = {
        id: session?.user?.id || "",
        name: session?.user?.name || null,
        image: session?.user?.image || null
    };

    return <ChatInterface
        currentUser={currentUser}
        initialConversations={conversations}
        allContacts={allContacts}
    />;
}
