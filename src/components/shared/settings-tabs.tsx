/**
 * SettingsTabs 组件
 * 
 * 用于设置页面的标签导航组件
 * 支持响应式设计：
 * - 移动端: 上下布局（默认）
 * - 桌面端: 上下或左右布局（可配置）
 */

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface SettingsTabItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface SettingsTabsProps {
  tabs: SettingsTabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * SettingsTabs - 设置页面标签组件
 * 
 * @example
 * <SettingsTabs
 *   tabs={[
 *     { 
 *       id: 'profile', 
 *       label: '个人资料',
 *       description: '管理个人信息',
 *       icon: User,
 *       content: <ProfileForm />
 *     }
 *   ]}
 *   defaultValue="profile"
 *   orientation="horizontal"
 * />
 */
export function SettingsTabs({
  tabs,
  defaultValue = tabs[0]?.id || "",
  onValueChange,
  orientation = "horizontal",
  className,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden",
        className
      )}
    >
      <Tabs value={activeTab} onValueChange={handleValueChange}>
        {isHorizontal ? (
          <>
            {/* 横向布局 - Tab 导航在上方 */}
            <div className="border-b bg-muted/30 px-6">
              <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none justify-start">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div
                      key={tab.id}
                      className="border-b-2 border-transparent data-[state=active]:border-primary"
                      data-state={activeTab === tab.id ? "active" : "inactive"}
                    >
                      <TabsTrigger
                        value={tab.id}
                        className="rounded-none bg-transparent hover:bg-muted/50 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-0 text-base"
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    </div>
                  );
                })}
              </TabsList>
            </div>

            {/* 横向布局 - 内容区域 */}
            <div className="p-6">
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="space-y-4">
                    {(tab.label || tab.description) && (
                      <div>
                        <h3 className="text-lg font-semibold">{tab.label}</h3>
                        {tab.description && (
                          <p className="text-sm text-muted-foreground">
                            {tab.description}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="mt-6">
                      {tab.content}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 纵向布局 - Tab 导航在左侧 */}
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r bg-muted/30">
                <TabsList className="h-auto w-full flex-col bg-transparent p-0 gap-0 rounded-none justify-start">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="w-full rounded-none justify-start bg-transparent hover:bg-muted/50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none border-0 text-left"
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{tab.label}</p>
                          {tab.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {tab.description}
                            </p>
                          )}
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* 纵向布局 - 内容区域 */}
              <div className="flex-1 p-6">
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    {tab.content}
                  </TabsContent>
                ))}
              </div>
            </div>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default SettingsTabs;
