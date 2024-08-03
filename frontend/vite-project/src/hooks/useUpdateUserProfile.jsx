import { useMutation,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const useUpdateUserProfile = () => {
const queryClient=useQueryClient();
const{mutateAsync:updateProfile,isPending:isUpdatingProfile}=useMutation({
    mutationFn: async (formData) => {
        try {
            const res = await fetch("/api/users/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
                const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update profile");
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    onSuccess: () => {
        toast.success("Profile updated successfully");
        Promise.all([queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] })])
        
    },
    onError:()=>{
        toast.error("Failed to update profile");
    }
})
return {updateProfile,isUpdatingProfile};
}

export default useUpdateUserProfile
