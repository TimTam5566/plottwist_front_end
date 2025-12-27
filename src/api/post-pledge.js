/**
 * post-pledge.js
 * 
 * This file provides an async function to submit a pledge to the backend API.
 * 
 * Function:
 * - `postPledge(projectId, pledgeData)`:
 *    - Sends a POST request to the `/projects/{projectId}/pledges/` endpoint with pledge details.
 *    - Includes authentication using a token from localStorage.
 *    - Formats the pledge data (amount, add_content, comment, anonymous) as required by the backend.
 *    - Handles errors by parsing the response and throwing a detailed error message if the request fails.
 *    - Returns the parsed JSON response containing the pledge data on success.
 * 
 * Linked to:
 * - Used by the `use-create-pledge` hook and `PledgeForm.jsx` component.
 * - Allows users to submit pledges to a specific project from the frontend.
 * - Ensures proper error handling and feedback for pledge submissions.
 */

import { API_URL } from "../config";

const ERROR_MESSAGES = {
    PROJECT_REQUIRED: "Project ID is required",
    AUTH_REQUIRED: "Authentication required",
    BAD_REQUEST: "Please check your pledge details"
};

export default async function postPledge(projectId, pledgeData) {
    if (!projectId) {
        throw new Error(ERROR_MESSAGES.PROJECT_REQUIRED);
    }

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const url = `${API_URL}/projects/${projectId}/pledges/`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                amount: pledgeData.amount,
                add_content: pledgeData.add_content,
                comment: pledgeData.comment || `Contributed ${pledgeData.amount} verse(s)`,
                anonymous: pledgeData.anonymous
            })
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            responseData = null;
        }

        if (!response.ok) {
            const errorMessage = responseData?.add_content?.[0] || 
                                responseData?.detail || 
                                `Error creating pledge (status ${response.status})`;
            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        throw error;
    }
}