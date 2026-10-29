import { QueryTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import type { ChatListItem } from '../../types/chat/converation.js';

export const getUserConversations = async (userId: number): Promise<ChatListItem[]> => {
  const query = `
    WITH private_ranked AS (
      SELECT
        CASE
          WHEN m.sender_id = :userId THEN m.receiver_id
          ELSE m.sender_id
        END AS other_user_id,
        m.created_at AS last_message_at,
        ROW_NUMBER() OVER (
          PARTITION BY
            CASE
              WHEN m.sender_id = :userId THEN m.receiver_id
              ELSE m.sender_id
            END
          ORDER BY m.created_at DESC, m.id DESC
        ) AS rn
      FROM messages AS m
      WHERE m.room_id IS NULL
        AND (
          m.sender_id = :userId
          OR m.receiver_id = :userId
        )
    ),

    private_chats AS (
      SELECT
        'private' AS type,
        u.id AS id,
        u.name AS name,
        p.last_message_at AS "lastMessageAt"
      FROM private_ranked AS p
      INNER JOIN users AS u
        ON u.id = p.other_user_id
      WHERE p.rn = 1
    ),

    group_chats AS (
      SELECT
        'group' AS type,
        r.id AS id,
        r.name AS name,
        latest.created_at AS "lastMessageAt"
      FROM room_members AS rm
      INNER JOIN rooms AS r
        ON r.id = rm.room_id
      LEFT JOIN LATERAL (
        SELECT m.created_at
        FROM messages AS m
        WHERE m.room_id = r.id
        ORDER BY m.created_at DESC, m.id DESC
        LIMIT 1
      ) AS latest ON TRUE
      WHERE rm.user_id = :userId
    )

    SELECT *
    FROM (
      SELECT * FROM private_chats
      UNION ALL
      SELECT * FROM group_chats
    ) AS chats
    ORDER BY
      "lastMessageAt" DESC NULLS LAST,
      type ASC,
      id ASC;
  `;

  return sequelize.query<ChatListItem>(query, {
    replacements: { userId },
    type: QueryTypes.SELECT,
  });
};
