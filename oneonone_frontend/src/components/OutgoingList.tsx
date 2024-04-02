import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosUtil"

type Friend = {
    id: number;
    username: string;
};

const OutgoingList = () => {
    const [outgoing, setOutgoing] = useState<Friend[]>([]);

    const fetchOutgoing = async () => {
        try {
            const response = await axiosInstance.get("/contacts/outgoing/");
            console.log(response);
            setOutgoing(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOutgoing();
    }, []);


    return (
        <ul className="divide-y divide-gray-200">
            {outgoing.map((friend) => (
                <li key={friend.id} className="flex justify-between items-center px-6 p-3 hover:bg-gray-50">
                    <span className="font-medium">{friend.username}</span>
                </li>
            ))}
        </ul>
    );
};

export default OutgoingList;