export const createGroup = async (formData, sendRequest) => {
  try {
    const response = await sendRequest("/groups/create", "post", formData, {
      headers: { "Content-Type": "application/json" },
    });
    // if (response?.status !== 201) throw new Error(response?.data?.message);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const get1Group = async (group, sendRequest) => {
  try {
    const response = await sendRequest(`/groups?group=${group}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getAdminGroups = async (sendRequest) => {
  try {
    const response = await sendRequest(`/groups/admin`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getMemberGroups = async (sendRequest) => {
  try {
    const response = await sendRequest(`/groups/member`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getInvitedGroups = async (sendRequest) => {
  try {
    const response = await sendRequest(`/groups/invited`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const editGroup = async (formData, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/edit`, "put", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getJoinRequests = async (groupId, page, limit, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/join-requests?page=${page}&limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getMembers = async (groupId, page, limit, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/members?page=${page}&limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getUserFriendsList = async (groupId, page, limit, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/friends-to-invite?page=${page}&limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getGroupDetail = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/${groupId}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const searchGroups = async (search, sendRequest) => {
  try {
    const response = await sendRequest(`/groups/search?searchText=${search}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const requestToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/request?groupId=${groupId}`,
      "post",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const deleteToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/kick?groupId=${groupId}`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const acceptToGroup = async (groupId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/accept?groupId=${groupId}`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const rejectRequestToGroup = async (
  groupId,
  requesterId,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/${requesterId}/reject`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const acceptRequestToGroup = async (
  groupId,
  requesterId,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/${requesterId}/accept`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const inviteUserToGroup = async (
  groupId,
  userToInviteId,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/${userToInviteId}/invite`,
      "post",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const createGroupPost = async (formData, sendRequest) => {
  try {
    const response = await sendRequest("/groups/post", "post", formData, {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getGroupPosts = async (
  groupId,
  status,
  page,
  limit,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/groups/${groupId}/posts?status=${status}&page=${page}&limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const rejectGroupPost = async (postId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/posts/${postId}/reject`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const approveGroupPost = async (postId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/groups/posts/${postId}/approve`,
      "put",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};
